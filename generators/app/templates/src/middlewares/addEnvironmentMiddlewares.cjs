const configuration = import("../../config");
const addEnvironmentMiddlewares = app => {
  if (configuration.nodeEnv === "development") {
    const addDevelopmentMiddlewares = require("./environments/addDevelopmentMiddlewares");
    addDevelopmentMiddlewares(app);
  }
};

module.exports = addEnvironmentMiddlewares;
