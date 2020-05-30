const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");
const insertAfter = require("../../lib/insertAfter");

const serverFilePath = "app.js";
const supportedViewEngines = ["handlebars", "none"];
const supportedTestFrameworks = ["jest"];
const supportedDbClients = ["sequelize"];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.dependencies = [];
    this.devDependencies = [];
    this.option("view-engine", {
      default: supportedViewEngines[0],
      type: String,
      description: `View engine to use (only handlebars is supported currently) valid values are: ${supportedViewEngines.join(
        ","
      )})`
    });

    this.option("test-framework", {
      default: supportedTestFrameworks[0],
      type: String,
      description: `Test framework to use (only jest is supported currently) valid values are: ${supportedTestFrameworks.join(
        ","
      )}`
    });

    this.option("db-client", {
      default: supportedDbClients[0],
      type: String,
      description: `Database "client"/ORM to use (only sequelize is supported currently) valid values are: ${supportedDbClients.join(
        ","
      )}`
    });

    this.errors = [];
  }

  get testFramework() {
    return this.option["test-framework"];
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
    this.fs.copyTpl(this.templatePath("package.json"), this.destinationPath("package.json"), {
      name: path.basename(this.destinationRoot()),
      appPath: serverFilePath
    });

    this.fs.copyTpl(this.templatePath("app.js"), this.destinationPath(serverFilePath));

    const publicDir = path.join(this.destinationPath("public"));
    this.fs.write(path.join(publicDir, ".gitkeep"), "");
  }

  nodemon() {
    this._modifyJson("package.json", json => {
      if (!json.scripts) {
        json.scripts = {};
      }

      json.scripts.dev = `nodemon ${serverFilePath}`;
    });

    this._addDependencies("nodemon", { dev: true });
  }

  linters() {
    [".eslintrc.cjs", ".gitignore", ".prettierrc"].forEach(file => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file));
    });

    const lintPackages = [
      "eslint",
      "eslint-config-airbnb",
      "eslint-plugin-import",
      "eslint-plugin-prettier",
      "install-peerdeps"
    ];

    this._addDependencies(lintPackages, { dev: true });
  }

  handlebars() {
    if (this.options["view-engine"] === "handlebars") {
      this._addDependencies(["express-handlebars"]);
      // eslint-disable-next-line no-unused-vars
      insertAfter(this, "snippets/handlebars/middleware.js", serverFilePath, nodePath => {
        return (
          nodePath.type === "VariableDeclaration" &&
          nodePath.node.declarations.length === 1 &&
          nodePath.node.declarations[0].id.name === "app"
        );
      });

      insertAfter(this, "snippets/handlebars/requires.js", serverFilePath, nodePath => {
        return (
          nodePath.type === "VariableDeclaration" &&
          nodePath.node.declarations.length === 1 &&
          nodePath.node.declarations[0].id.name === "app"
        );
      });

      [
        "public/css/vendor/normalize.min.css",
        "public/css/main.css",
        "views/layouts/default.hbs"
      ].forEach(file => {
        this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), {
          name: path.basename(this.destinationRoot())
        });
      });
    }
  }

  jest() {
    if (this.options["test-framework"] === "jest") {
      this._addDependencies(["jest", "babel-jest", "@babel/core", "@babel/preset-env"], {
        dev: true
      });
      ["babel.config.cjs", "jest.config.cjs"].forEach(file => {
        this.fs.copyTpl(this.templatePath(file), this.destinationPath(this.destinationPath(file)));
      });

      this._modifyJson("package.json", json => {
        if (!json.scripts) {
          json.scripts = {};
        }

        json.scripts.test = "jest";
        json.scripts.ci = "jest --coverage";
      });
    }
  }

  sequelize() {
    if (this.options["db-client"] === "sequelize") {
      this._addDependencies(["sequelize", "pg"]);
      this._addDependencies("sequelize-cli", { dev: true });

      [".sequelizerc", "config/database.js"].forEach(file => {
        this.fs.copyTpl(this.templatePath(file), this.destinationPath(this.destinationPath(file)), {
          name: path.basename(this.destinationRoot())
        });
      });
    }
  }

  herokuProcfile() {
    this.fs.copyTpl(this.templatePath("Procfile"), this.destinationPath("Procfile"));
  }

  dotEnv() {
    this._addDependencies("dotenv", { dev: true });
    [
      ".env.example",
      "src/boot/index.cjs",
      "src/boot/environments/development.js",
      "src/boot/environments/test.js"
    ].forEach(filePath => {
      this._copyTemplate(filePath);
    });

    if (this.testFramwork !== "none") {
      this._copyTemplate("test/testHelper.js");
    }
  }

  config() {
    this._addDependencies("errorhandler", { dev: true });
    [
      "src/middlewares/environments/addDevelopmentMiddlewares.js",
      "src/middlewares/addEnvironmentMiddlewares.cjs",
      "src/middlewares/errorHandler.js",
      "config.js"
    ].forEach(filePath => {
      this._copyTemplate(filePath);
    });
  }

  nvmrc() {
    this.fs.copyTpl(this.templatePath(".nvmrc"), this.destinationPath(".nvmrc"));
  }

  install() {
    this.yarnInstall(this.devDependencies, { dev: true });
    this.yarnInstall(this.dependencies, { save: true });
  }

  end() {
    const peerDepPackages = ["eslint-config-airbnb"];
    peerDepPackages.forEach(pkg => {
      this.spawnCommandSync("yarn", ["run", "install-peerdeps", "--dev", "-Y", pkg], {
        cwd: this.destinationRoot()
      });
    });

    if (this.options["db-client"] === "sequelize") {
      const sequelizeCmd = `sequelize`;
      this.spawnCommandSync("yarn", ["run", sequelizeCmd, "init:migrations"], {
        cwd: this.destinationRoot()
      });
      this.spawnCommandSync("yarn", ["run", sequelizeCmd, "init:seeders"], {
        cwd: this.destinationRoot()
      });
      this.spawnCommandSync("yarn", ["run", sequelizeCmd, "init:models"], {
        cwd: this.destinationRoot()
      });
    }
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

  _validateDbClient() {
    this._validateWhitelistedOption("db-client", supportedDbClients, "database client / ORM");
  }

  _validateWhitelistedOption(optionName, validValues, humanName) {
    if (this.options[optionName] && !validValues.includes(this.options[optionName])) {
      const errorMessage = `Invalid ${humanName} supplied. Valid options are: ${validValues.join(
        ","
      )}`;
      this.errors.push(errorMessage);
    }
  }

  _modifyJson(jsonPath, jsonModifier) {
    const json = this.fs.readJSON(this.destinationPath(jsonPath));
    jsonModifier(json);
    this.fs.writeJSON(jsonPath, json);
  }

  _addDependencies(packages, { dev = false } = {}) {
    const packageList = Array.isArray(packages) ? packages : [packages];
    if (dev) {
      this.devDependencies = [...this.devDependencies, ...packageList];
    } else {
      this.dependencies = [...this.dependencies, ...packageList];
    }
  }

  _copyTemplate(filePath, options = {}) {
    return this.fs.copyTpl(this.templatePath(filePath), this.destinationPath(filePath), options);
  }
};
