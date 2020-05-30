import errorHandler from "../errorHandler";

addDevelopmentMiddlewares = app => {
  app.use(errorHandler());
};

export default addDevelopmentMiddlewares;
