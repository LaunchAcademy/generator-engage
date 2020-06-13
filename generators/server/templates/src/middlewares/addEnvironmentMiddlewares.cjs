const configuration = import("../../config/index.js");
const addEnvironmentMiddlewares = app => {
  if (configuration.nodeEnv === "development") {
    const addDevelopmentMiddlewares = require("./environments/addDevelopmentMiddlewares");
    addDevelopmentMiddlewares(app);
  }
};

module.exports = addEnvironmentMiddlewares;
