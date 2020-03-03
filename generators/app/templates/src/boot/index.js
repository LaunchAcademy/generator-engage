const fs = require("fs");
const path = require("path");
const configuration = require("../../config");

const pathWithoutExtension = path.join(__dirname, `environments/${configuration.nodeEnv}`);

if (fs.existsSync(`${pathWithoutExtension}.js`)) {
  require(`${pathWithoutExtension}`);
}
