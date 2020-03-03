const configuration = require("../../config/index");
const addEnvironmentMiddlewares = app => {
  if (configuration.nodeEnv === "development") {
    const addDevelopmentMiddlewares = require("./environments/addDevelopmentMiddlewares");
    addDevelopmentMiddlewares(app);
  }
};

module.exports = addEnvironmentMiddlewares;
