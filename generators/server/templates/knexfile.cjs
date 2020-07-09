const config = require("./src/config.js");
const path = require("path");

module.exports = {
  connection: config.default.databaseUrl,
  client: "pg",
  migrations: {
    directory: path.join(__dirname, "src/db/migrations"),
    extension: "js",
  },
};
