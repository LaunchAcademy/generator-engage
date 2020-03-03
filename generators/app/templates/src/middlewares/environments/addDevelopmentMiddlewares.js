const errorHandler = require("../errorHandler");

addDevelopmentMiddlewares = app => {
  app.use(errorHandler());
};

module.exports = addDevelopmentMiddlewares;
