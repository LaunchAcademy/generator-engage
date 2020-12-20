const {
  supportedViewEngines,
  supportedTestFrameworks,
  supportedDbClients,
} = require("./constants");

const initServerOptions = (generator) => {
  generator.option("viewEngine", {
    default: supportedViewEngines[0],
    type: String,
    description: `View engine to use (only handlebars is supported currently) valid values are: ${supportedViewEngines.join(
      ","
    )})`,
  });

  generator.option("testFramework", {
    default: supportedTestFrameworks[0],
    type: String,
    description: `Test framework to use (only jest is supported currently) valid values are: ${supportedTestFrameworks.join(
      ","
    )}`,
  });

  generator.option("dbClient", {
    default: "objection",
    type: String,
    description: `Database "client"/ORM to use. Valid values are: ${supportedDbClients.join(",")}`,
  });

  generator.option("sessionsEnabled", {
    default: true,
    type: Boolean,
    description: "Whether express-session should be configured",
  });

  generator.option("e2e", {
    default: "cypress",
    type: String,
    description: `E2E framework to use (only cypress is supported currently) valid values are: cypress`,
  });
};

module.exports = initServerOptions;
