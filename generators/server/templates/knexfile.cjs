const path = require("path");
const getDatabaseUrl = require("./src/config/getDatabaseUrl.cjs");

const migrationPath = "src/db/migrations";

module.exports = {
  connection: getDatabaseUrl(process.env.NODE_ENV || "development"),
  client: "pg",
  migrations: {
    directory: migrationPath,
    extension: "cjs",
    stub: path.join(migrationPath, "migration.stub.cjs"),
  },
};
