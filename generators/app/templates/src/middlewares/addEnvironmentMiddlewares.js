import addDevelopmentMiddlewares from "./environments/addDevelopmentMiddlewares.js";

const addEnvironmentMiddlewares = app => {
  addDevelopmentMiddlewares(app);
};

export default addEnvironmentMiddlewares;
