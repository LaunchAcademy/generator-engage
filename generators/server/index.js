const chalk = require("chalk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const EngageGenerator = require("../../lib/EngageGenerator");
const insertAfter = require("../../lib/insertAfter");
const insertBefore = require("../../lib/insertBefore.js");
const getNodeVersion = require("../../lib/getNodeVersion");

const { supportedViewEngines, supportedTestFrameworks } = require("./constants");
const initServerOptions = require("./initServerOptions");

const serverFileName = "src/app.js";

module.exports = class ServerGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    initServerOptions(this);
    this.option("clientAppPath", {
      default: "",
      type: String,
      description: "where a correlating client app is installed",
    });

    this.errors = [];
  }

  initializing() {
    this._validateViewEngine();
    this._validateTestFramework();
    this._validateDbClient();

    if (this.errors.length > 0) {
      const done = this.async();
      this.env.error(chalk.red(this.errors.join("\n")));
      done();
    }
  }

  sayHello() {
    this.log(chalk.green("Engage!"));
  }

  writingBase() {
    const fundamentalPackages = ["express", "body-parser", "morgan"];
    this._addDependencies(fundamentalPackages);
    this.fs.copyTpl(this.templatePath("package.json"), this.generatedPath("package.json"), {
      name: this._getName(),
      appPath: serverFileName,
      nodeVersion: getNodeVersion(),
    });

    this.fs.copyTpl(this.templatePath("src/app.js"), this.generatedPath(serverFileName));
    this._copyTemplate("src/routes/rootRouter.js", { options: this.options });

    this.fs.write(this.generatedPath("public", ".gitkeep"), "");
  }

  nodemon() {
    this._modifyJson("package.json", (json) => {
      if (!json.scripts) {
        json.scripts = {};
      }

      json.scripts.clean = `rm -rf ./public/dist`;
      json.scripts.dev = `yarn run clean && nodemon ${serverFileName}`;
      json.scripts["dev:debug"] = "nodemon --inspect-brk src/app.js";
    });

    this._addDependencies("nodemon", null, { dev: true });
  }

  linters() {
    [".eslintrc.cjs", ".prettierrc"].forEach((file) => {
      this.fs.copyTpl(this.templatePath(file), this.generatedPath("..", file));
    });
    this.fs.copyTpl(this.templatePath(".npmignore"), this.generatedPath("..", ".gitignore"));

    const lintPackages = [
      "eslint",
      "eslint-config-airbnb",
      "eslint-plugin-import",
      "eslint-plugin-prettier",
      "eslint-config-prettier",
      "install-peerdeps",
    ];

    this._addDependencies(lintPackages, null, { dev: true });
  }

  handlebars() {
    if (this.options.viewEngine === "handlebars") {
      this._addDependencies("express-handlebars", "^5.2.0");

      // eslint-disable-next-line no-unused-vars
      insertAfter(
        this,
        "snippets/handlebars/middleware.js",
        this.generatedPath(serverFileName),
        (nodePath) => {
          return (
            nodePath.type === "VariableDeclaration" &&
            nodePath.node.declarations.length === 1 &&
            nodePath.node.declarations[0].id.name === "app"
          );
        }
      );

      insertAfter(
        this,
        "snippets/handlebars/requires.js",
        this.generatedPath(serverFileName),
        (nodePath) => {
          return (
            nodePath.type === "VariableDeclaration" &&
            nodePath.node.declarations.length === 1 &&
            nodePath.node.declarations[0].id.name === "app"
          );
        }
      );

      [
        "public/css/vendor/normalize.min.css",
        "public/css/main.css",
        "public/favicon.ico",
        "views/layouts/default.hbs",
      ].forEach((file) => {
        this.fs.copyTpl(this.templatePath(file), this.generatedPath(file), {
          name: this._getName(),
        });
      });

      if (this.options.clientAppPath !== "") {
        const clientLayoutPath = "views/layouts/client.hbs";
        this.fs.copyTpl(this.templatePath(clientLayoutPath), this.generatedPath(clientLayoutPath));

        this._addDependencies("webpack", "^5.3.2", { dev: true });
        this._addDependencies("webpack-dev-middleware", "^4.0.0", { dev: true });
        this._addDependencies("webpack-hot-middleware", null, { dev: true });

        [
          "src/routes/clientRouter.js",
          "src/middlewares/addClientMiddlewares.js",
          "src/config/getClientIndexPath.js",
          "src/middlewares/webpackMiddlewares.js",
        ].forEach((file) => {
          this._copyTemplate(file, { options: this.options });
        });

        insertBefore(
          this,
          "snippets/client/requires.js",
          this.generatedPath("src/routes/rootRouter.js"),
          (nodePath) => {
            return (
              nodePath.type === "VariableDeclaration" &&
              nodePath.node.declarations.length === 1 &&
              nodePath.node.declarations[0].id.name === "rootRouter"
            );
          }
        );

        insertAfter(
          this,
          "snippets/client/use.js",
          this.generatedPath("src/routes/rootRouter.js"),
          (nodePath) => {
            return (
              nodePath.type === "VariableDeclaration" &&
              nodePath.node.declarations.length === 1 &&
              nodePath.node.declarations[0].id.name === "rootRouter"
            );
          }
        );
      }
    }
  }

  dbClient() {
    if (this.options.dbClient !== "") {
      const databaseUrlFile = "src/config/getDatabaseUrl.cjs";
      this.fs.copyTpl(this.templatePath(databaseUrlFile), this.generatedPath(databaseUrlFile), {
        name: this._getName(),
      });
      this._addDependencies("pg");
    }
    if (this.options.dbClient === "pg") {
      const middlewareFile = "src/middlewares/addDbMiddleware.js";
      this.fs.copyTpl(this.templatePath(middlewareFile), this.generatedPath(middlewareFile), {
        name: this._getName(),
      });
    } else if (this.options.dbClient === "objection") {
      this._addDependencies("knex");
      this._addDependencies("objection");
      [
        "knexfile.cjs",
        "bin/seed.js",
        "src/models/Model.js",
        "src/models/package.json",
        "src/models/index.js",
        "src/boot/model.cjs",
        "src/db/migrations/migration.stub.cjs",
        "src/db/Seeder.js",
        "test/utils/truncateModel.cjs",
        "src/console.js",
      ].forEach((file) => {
        this._copyTemplate(file, { options: this.options });
      });
      this._modifyJson("package.json", (json) => {
        if (!json.scripts) {
          json.scripts = {};
        }
        json.scripts.console = "node --experimental-repl-await ./src/console.js";
        json.scripts["migrate:latest"] = "knex --knexfile ./knexfile.cjs migrate:latest";
        json.scripts["migrate:rollback"] = "knex --knexfile ./knexfile.cjs migrate:rollback";
        json.scripts["migrate:make"] = "knex --knexfile ./knexfile.cjs migrate:make";
        json.scripts["db:seed"] = "node ./bin/seed.js";
        json.scripts["db:test:migrate"] = "NODE_ENV='test' yarn run migrate:latest";
        json.scripts["db:e2e:migrate"] = "NODE_ENV='e2e' yarn run migrate:latest";
      });
    }
  }

  jest() {
    if (this.options.testFramework === "jest") {
      this._addDependencies(
        ["jest", "babel-jest", "@babel/core", "@babel/preset-env", "@types/jest", "@types/express"],
        null,
        {
          dev: true,
        }
      );
      ["babel.config.cjs", "jest.config.cjs"].forEach((file) => {
        this.fs.copyTpl(this.templatePath(file), this.generatedPath(file));
      });

      this._modifyJson("package.json", (json) => {
        if (!json.scripts) {
          json.scripts = {};
        }

        json.scripts.test = "jest";
        json.scripts.ci = "jest --coverage";
      });
    }
  }

  herokuProcfile() {
    this.fs.copyTpl(this.templatePath("Procfile"), this.generatedPath("Procfile"));
  }

  dotEnv() {
    this._addDependencies("dotenv", "^8.2.0", { dev: true });
    [
      ".env.example",
      "src/boot.js",
      "src/boot/environments/development.js",
      "src/boot/environments/test.js",
    ].forEach((filePath) => {
      this._copyTemplate(filePath, { options: this.options });
    });

    if (this.options.testFramework !== "none") {
      this._copyTemplate("test/testHelper.js");
    }
  }

  config() {
    this._addDependencies("errorhandler", null, { dev: true });
    [
      "src/middlewares/environments/addDevelopmentMiddlewares.js",
      "src/middlewares/addEnvironmentMiddlewares.js",
      "src/middlewares/addMiddlewares.js",
      "src/middlewares/errorHandler.js",
      "src/config/getNodeEnv.js",
      "src/config.js",
    ].forEach((filePath) => {
      this._copyTemplate(filePath, { options: this.options, name: this._getName() });
    });
  }

  secretsHandling() {
    ["scripts/generate-secret.js"].forEach((script) => {
      this._copyTemplate(script);
    });
  }

  expressSession() {
    if (this.options.sessionsEnabled) {
      this._addDependencies("cookie-session");
      this._copyTemplate("src/middlewares/addExpressSession.js", { name: this._getName() });
      this._modifyJson("package.json", (json) => {
        if (!json.scripts) {
          json.scripts = {};
        }

        json.scripts["generate-secret"] = `./scripts/generate-secret.js`;
      });
      this.fs.write(this.generatedPath(".env"), `SESSION_SECRET="${uuidv4()}"\n`);
    }
  }

  passport() {
    if (this.options.authentication === "passport") {
      if (this.options.dbClient !== "objection") {
        throw new Error("Only the objection database client is supported with passport");
      }

      this._addDependencies(["passport", "passport-local", "bcrypt", "objection-unique"]);

      [
        "src/authentication/deserializeUser.js",
        "src/authentication/passportStrategy.js",
        "src/middlewares/addPassport.js",
        "src/db/migrations/20210101210207_createUsers.cjs",
        "src/models/User.js",
        "src/routes/api/v1/usersRouter.js",
        "src/routes/api/v1/userSessionsRouter.js",
      ].forEach((filePath) => {
        this._copyTemplate(filePath, { options: this.options });
      });
    }
  }

  vsCodeWorkspace() {
    const filePath = ".vscode/settings.json";
    this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
      name: this._getName(),
    });
  }

  nvmrc() {
    this.fs.copyTpl(this.templatePath(".nvmrc"), this.generatedPath(".nvmrc"));
  }

  install() {
    this._install();
  }

  e2eSupport() {
    if (this.options.e2e === "cypress") {
      this._modifyJson("package.json", (json) => {
        json.scripts["dev:e2e"] = "NODE_ENV=e2e PORT=8765 nodemon src/app.js";
      });
      const envPath = "src/boot/environments/e2e.js";
      this.fs.copyTpl(this.templatePath(envPath), this.generatedPath(envPath));
    }
  }

  end() {
    const peerDepPackages = ["eslint-config-airbnb"];
    peerDepPackages.forEach((pkg) => {
      this.spawnCommandSync("yarn", ["run", "install-peerdeps", "--dev", "-Y", pkg], {
        cwd: this.generatedPath(),
      });
    });
  }

  _validateViewEngine() {
    if (this.options.viewEngine && !supportedViewEngines.includes(this.options.viewEngine)) {
      this._validateWhitelistedOption("viewEngine", supportedViewEngines, "view engine");
    }
  }

  _validateTestFramework() {
    this._validateWhitelistedOption("testFramework", supportedTestFrameworks, "test framework");
  }

  // eslint-disable-next-line class-methods-use-this
  _validateDbClient() {
    // this._validateWhitelistedOption("dbClient", supportedDbClients, "database client / ORM");
  }

  _getName() {
    return path.basename(this.generatedPath(".."));
  }
};
