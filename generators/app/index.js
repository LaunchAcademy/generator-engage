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
    this.devDependencies = [...this.devDependencies, "nodemon"];
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

    this.devDependencies = [...this.devDependencies, ...lintPackages];
  }

  install() {
    this.yarnInstall(this.devDependencies, { dev: true });
    this.yarnInstall(this.dependencies, { save: true });
  }

  end() {
    const peerDepPackages = ["eslint-config-airbnb"];
    peerDepPackages.forEach(pkg => {
      const result = this.spawnCommandSync(
        "yarn",
        ["run", "install-peerdeps", "--dev", "-Y", pkg],
        { cwd: this.destinationRoot() }
      );
      this.log(result);
    });
  }
};
