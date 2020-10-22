const chalk = require("chalk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const EngageGenerator = require("../../lib/EngageGenerator");
const insertAfter = require("../../lib/insertAfter");

const serverFileName = "app.js";
const supportedViewEngines = ["handlebars", "none"];
const supportedTestFrameworks = ["jest"];
const supportedDbClients = ["objection", "pg"];

module.exports = class ServerGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    this.option("view-engine", {
      default: supportedViewEngines[0],
      type: String,
      description: `View engine to use (only handlebars is supported currently) valid values are: ${supportedViewEngines.join(
        ","
      )})`,
    });

    this.option("test-framework", {
      default: supportedTestFrameworks[0],
      type: String,
      description: `Test framework to use (only jest is supported currently) valid values are: ${supportedTestFrameworks.join(
        ","
      )}`,
    });

    this.option("db-client", {
      default: "objection",
      type: String,
      description: `Database "client"/ORM to use. Valid values are: ${supportedDbClients.join(
        ","
      )}`,
    });

    this.option("sessions-enabled", {
      default: true,
      type: Boolean,
      description: "Whether express-session should be configured",
    });

    this.option("client-app-path", {
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
    });

    this.fs.copyTpl(this.templatePath("app.js"), this.generatedPath(serverFileName));

    this.fs.write(this.generatedPath("public", ".gitkeep"), "");
  }

  nodemon() {
    this._modifyJson("package.json", (json) => {
      if (!json.scripts) {
        json.scripts = {};
      }

      json.scripts.dev = `nodemon ${serverFileName}`;
    });

    this._addDependencies("nodemon", null, { dev: true });
  }

  linters() {
    [".eslintrc.cjs", ".gitignore", ".prettierrc"].forEach((file) => {
      this.fs.copyTpl(this.templatePath(file), this.generatedPath("..", file));
    });

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
    if (this.options["view-engine"] === "handlebars") {
      this._addDependencies(["express-handlebars"]);
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
        "views/layouts/default.hbs",
      ].forEach((file) => {
        this.fs.copyTpl(this.templatePath(file), this.generatedPath(file), {
          name: this._getName(),
        });
      });

      if (this.options["client-app-path"] !== "") {
        const clientLayoutPath = "views/layouts/client.hbs";
        this.fs.copyTpl(this.templatePath(clientLayoutPath), this.generatedPath(clientLayoutPath));
      }
    }
  }

  dbClient() {
    if (this.options["db-client"] !== "") {
      const databaseUrlFile = "src/config/getDatabaseUrl.cjs";
      this.fs.copyTpl(this.templatePath(databaseUrlFile), this.generatedPath(databaseUrlFile), {
        name: this._getName(),
      });
      this._addDependencies("pg");
    }
    if (this.options["db-client"] === "pg") {
      const middlewareFile = "src/middlewares/addDbMiddleware.js";
      this.fs.copyTpl(this.templatePath(middlewareFile), this.generatedPath(middlewareFile), {
        name: this._getName(),
      });
    } else if (this.options["db-client"] === "objection") {
      this._addDependencies("knex");
      this._addDependencies("objection");
      [
        "knexfile.cjs",
        "src/models/Model.js",
        "src/models/package.json",
        "src/boot/model.js",
        "src/db/migrations/migration.stub.cjs",
        "test/utils/truncateModel.js",
        "src/console.js",
      ].forEach((file) => {
        this.fs.copyTpl(this.templatePath(file), this.generatedPath(file));
      });
      this._modifyJson("package.json", (json) => {
        if (!json.scripts) {
          json.scripts = {};
        }
        json.scripts.console = "node --experimental-repl-await ./src/console.js";
        json.scripts["migrate:latest"] = "knex --knexfile ./knexfile.cjs migrate:latest";
        json.scripts["migrate:rollback"] = "knex --knexfile ./knexfile.cjs migrate:rollback";
        json.scripts["migrate:make"] = "knex --knexfile ./knexfile.cjs migrate:make";
      });
    }
  }

  jest() {
    if (this.options["test-framework"] === "jest") {
      this._addDependencies(
        ["jest", "babel-jest", "@babel/core", "@babel/preset-env", "@types/jest"],
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
    this._addDependencies("dotenv", null, { dev: true });
    [
      ".env.example",
      "src/boot.js",
      "src/boot/environments/development.js",
      "src/boot/environments/test.js",
    ].forEach((filePath) => {
      this._copyTemplate(filePath, { options: this.options });
    });

    if (this.options["test-framework"] !== "none") {
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
    if (this.options["sessions-enabled"]) {
      this._addDependencies("cookie-session");
      this._copyTemplate("src/middlewares/addExpressSession.js");
      this._modifyJson("package.json", (json) => {
        if (!json.scripts) {
          json.scripts = {};
        }

        json.scripts["generate-secret"] = `./scripts/generate-secret.js`;
      });
      this.fs.write(this.generatedPath(".env"), `SESSION_SECRET="${uuidv4()}"\n`);
    }
  }

  nvmrc() {
    this.fs.copyTpl(this.templatePath(".nvmrc"), this.generatedPath(".nvmrc"));
  }

  install() {
    this._install();
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
    if (
      this.options["view-engine"] &&
      !supportedViewEngines.includes(this.options["view-engine"])
    ) {
      this._validateWhitelistedOption("view-engine", supportedViewEngines, "view engine");
    }
  }

  _validateTestFramework() {
    this._validateWhitelistedOption("test-framework", supportedTestFrameworks, "test framework");
  }

  // eslint-disable-next-line class-methods-use-this
  _validateDbClient() {
    // this._validateWhitelistedOption("db-client", supportedDbClients, "database client / ORM");
  }

  _getName() {
    return path.basename(this.generatedPath(".."));
  }
};
