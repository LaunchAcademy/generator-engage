import dotenv from "dotenv";
import getNodeEnv from "../../config/getNodeEnv.js";

if (getNodeEnv() === "development") {
  // development specific middlewares here
  dotenv.config();
}
