const config = await import("../config.js");

const getMiddlewares = async () => {
  let middlewareList = [];
  if (config.default.nodeEnv !== "production") {
    const { default: middlewareFunc } = await import("./webpackMiddlewares.js");
    middlewareList = middlewareFunc();
  }
  return middlewareList;
};

export default async (app) => {
  const middlewares = await getMiddlewares();
  if (middlewares.length > 0) {
    app.use(middlewares);
  }
};
