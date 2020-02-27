"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const path = require("path");

module.exports = class extends Generator {
  sayHello() {
    this.log(chalk.green("Engage!"));
  }

  install() {
    const fundamentalPackages = ["express", "body-parser", "morgan"];
    this.yarnInstall(fundamentalPackages, { save: true });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { name: path.basename(this.destinationRoot()) }
    );

    this.fs.copyTpl(
      this.templatePath("app.js"),
      this.destinationPath("app.js")
    );

    const publicDir = path.join(this.destinationPath("public"));
    this.fs.write(path.join(publicDir, ".gitkeep"), "");
  }
};
