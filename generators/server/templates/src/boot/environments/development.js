import getNodeEnv from "../../config/getNodeEnv.js";

if (getNodeEnv() === "development") {
  // development specific middlewares here
  const { default: dotenv } = await import("dotenv");
  await dotenv.config();
}
