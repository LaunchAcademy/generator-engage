const {
  supportedViewEngines,
  supportedTestFrameworks,
  supportedDbClients,
} = require("./constants");

const initServerOptions = (generator) => {
  generator.option("view-engine", {
    default: supportedViewEngines[0],
    type: String,
    description: `View engine to use (only handlebars is supported currently) valid values are: ${supportedViewEngines.join(
      ","
    )})`,
  });

  generator.option("test-framework", {
    default: supportedTestFrameworks[0],
    type: String,
    description: `Test framework to use (only jest is supported currently) valid values are: ${supportedTestFrameworks.join(
      ","
    )}`,
  });

  generator.option("db-client", {
    default: "objection",
    type: String,
    description: `Database "client"/ORM to use. Valid values are: ${supportedDbClients.join(",")}`,
  });

  generator.option("sessions-enabled", {
    default: true,
    type: Boolean,
    description: "Whether express-session should be configured",
  });
};

module.exports = initServerOptions;
