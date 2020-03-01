const fs = require("fs");
const path = require("path");

const pathWithoutExtension = path.join(__dirname, `environments/${process.env.NODE_ENV}`);

if (fs.existsSync(`${pathWithoutExtension}.js`)) {
  require(`${pathWithoutExtension}`);
}
