const fs = require("fs");
const path = require("path");
const configuration = import("../../config/index.js");

const pathWithoutExtension = path.join(__dirname, `environments/${configuration.nodeEnv}`);

if (fs.existsSync(`${pathWithoutExtension}.js`)) {
  require(`${pathWithoutExtension}`);
}
