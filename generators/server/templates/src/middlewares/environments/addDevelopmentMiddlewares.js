import errorHandler from "../errorHandler.js";
import config from "../../config.js";

const addDevelopmentMiddlewares = app => {
  if (config.nodeEnv === "development") {
    app.use(errorHandler());
  }
};

export default addDevelopmentMiddlewares;
