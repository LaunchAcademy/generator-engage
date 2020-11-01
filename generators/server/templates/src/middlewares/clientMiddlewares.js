const config = await import("../config.js");

export default async () => {
  let middlewareList = [];
  if (config.default.nodeEnv !== "production") {
    const { default: middlewareFunc } = await import("./webpackMiddlewares.js");
    middlewareList = middlewareFunc();
  }
  return middlewareList;
};
