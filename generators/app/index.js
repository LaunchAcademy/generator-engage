const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");

const serverFilePath = "app.js";

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.dependencies = [];
    this.devDependencies = [];
  }

  sayHello() {
    this.log(chalk.green("Engage!"));
  }

  writingBase() {
    const fundamentalPackages = ["express", "body-parser", "morgan"];
    this.dependencies = [...this.dependencies, ...fundamentalPackages];
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { name: path.basename(this.destinationRoot()), appPath: serverFilePath }
    );

    this.fs.copyTpl(
      this.templatePath("app.js"),
      this.destinationPath(serverFilePath)
    );

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
    this.devDependencies = [...this.devDependencies, "nodemon"];
  }

  installDeps() {
    this.yarnInstall(this.devDependencies, { dev: true });
    this.yarnInstall(this.dependencies, { save: true });
  }
};
