const path = require("path");

const EngageGenerator = require("../../lib/EngageGenerator");
const getNodeVersion = require("../../lib/getNodeVersion");
const initClientOptions = require("../client/initClientOptions");
const initServerOptions = require("../server/initServerOptions");

module.exports = class AppGenerator extends EngageGenerator {
  constructor(args, options) {
    super(args, options);
    initServerOptions(this);
    initClientOptions(this);
  }

  initializing() {
    this.composeWith(require.resolve("../client"), {
      ...this.options,
      generateInto: path.join(this.options.generateInto, "client"),
      outputDir: "../server/public/dist",
    });
    this.composeWith(require.resolve("../server"), {
      ...this.options,
      generateInto: path.join(this.options.generateInto, "server"),
      clientAppPath: this.destinationPath("client"),
    });
  }

  writeBase() {
    ["package.json", "Procfile"].forEach((filePath) => {
      this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
        name: path.basename(this.generatedPath()),
        nodeVersion: getNodeVersion(),
      });
    });
  }
};
