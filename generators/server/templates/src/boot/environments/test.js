import dotenv from "dotenv";
import getNodeEnv from "../../config/getNodeEnv.js";

if (getNodeEnv() === "test") {
  // test specific middlewares here
  dotenv.config();
}
