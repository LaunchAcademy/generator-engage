const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");
const insertAfter = require("../../lib/insertAfter");

const serverFilePath = "app.js";
const supportedViewEngines = ["handlebars"];

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.dependencies = [];
    this.devDependencies = [];
    this.option("view-engine", {
      default: supportedViewEngines[0],
      type: String,
      description: "What view engine to use (only handlebars is supported currently)"
    });
  }

  initializing() {
    this._validateViewEngine();
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
    const packageJson = this.fs.readJSON("package.json");
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.dev = `nodemon ${serverFilePath}`;
    this.fs.writeJSON("package.json", packageJson);
    this._addDependencies("nodemon", { dev: true });
  }

  linters() {
    [".eslintrc", ".gitignore", ".prettierrc"].forEach(file => {
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
        nodePath.node.declarations[0].id.name === "bodyParser"
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
  }

  _validateViewEngine() {
    if (
      this.options["view-engine"] &&
      !supportedViewEngines.includes(this.options["view-engine"])
    ) {
      const done = this.async();
      this.env.error(
        chalk.red(
          `Invalid view engine supplied. Valid options are: ${supportedViewEngines.join(",")}`
        )
      );
      done();
    }
  }

  _addDependencies(packages, { dev = false } = {}) {
    const packageList = Array.isArray(packages) ? packages : [packages];
    if (dev) {
      this.devDependencies = [...this.devDependencies, ...packageList];
    } else {
      this.dependencies = [...this.dependencies, ...packageList];
    }
  }
};
