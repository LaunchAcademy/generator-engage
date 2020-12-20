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

    if (this.options.e2e && this.options.e2e !== "none") {
      this.composeWith(require.resolve("../e2e"), {
        ...this.options,
        generateInto: path.join(this.options.generateInto, "e2e"),
      });
    }
  }

  writeBase() {
    ["package.json", "Procfile"].forEach((filePath) => {
      this.fs.copyTpl(this.templatePath(filePath), this.generatedPath(filePath), {
        name: path.basename(this.generatedPath()),
        nodeVersion: getNodeVersion(),
      });
    });
  }

  e2eSupport() {
    if (this.options.e2e === "cypress") {
      this._modifyJson("package.json", (json) => {
        const name = path.basename(this.generatedPath());
        json.scripts = {
          ...json.scripts,
          "dev:cypress": `yarn workspace ${name}-server dev:e2e`,
          "e2e:open": `yarn workspace ${name}-e2e e2e:open`,
          "e2e:run": `yarn workspace ${name}-e2e e2e:run`,
        };
        json.workspaces.push("e2e");
      });
    }
  }
};
