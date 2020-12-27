const path = require("path");
const EngageGenerator = require("../../lib/EngageGenerator");
const getNodeVersion = require("../../lib/getNodeVersion");
const initE2eOptions = require("./initE2eOptions");

const initServerOptions = require("../server/initServerOptions");

module.exports = class AppGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    initE2eOptions(this);
    initServerOptions(this);
  }

  writeBase() {
    [
      "package.json",
      ".prettierrc",
      "cypress.json",
      ".vscode/settings.json",
      "cypress/integration/hello.js",
    ].forEach((filePath) => {
      this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
        options: this.options,
        name: path.basename(this.generatedPath("../")),
        nodeVersion: getNodeVersion(),
      });
    });

    this.fs.copyTpl(this.templatePath(".npmignore"), this.generatedPath(".gitignore"));
  }

  handleDb() {
    if (this.options.dbClient === "objection") {
      ["cypress/plugins/index.js", "cypress/plugins/db.js"].forEach((filePath) => {
        this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath));
      });
    }
  }

  install() {
    this._install();
  }
};
