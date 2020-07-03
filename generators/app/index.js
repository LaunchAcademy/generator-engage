const path = require("path");

const EngageGenerator = require("../../lib/EngageGenerator");

module.exports = class AppGenerator extends EngageGenerator {
  initializing() {
    this.composeWith(require.resolve("../client"), {
      ...this.options,
      generateInto: path.join(this.options.generateInto, "client")
    });
    this.composeWith(require.resolve("../server"), {
      ...this.options,
      generateInto: path.join(this.options.generateInto, "server")
    });
  }

  writeBase() {
    ["package.json", "Procfile"].forEach(filePath => {
      this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
        name: path.basename(this.generatedPath())
      });
    });
  }
};
