import getNodeEnv from "../../config/getNodeEnv.js";

if (getNodeEnv() === "e2e") {
  // development specific middlewares here
  const { default: dotenv } = await import("dotenv");
  await dotenv.config();
}
