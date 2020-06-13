import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import "./src/boot.js";
import configuration from "./src/config.js";
import addMiddlewares from "./src/middlewares/addMiddlewares.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(import.meta.url, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

addMiddlewares(app);

app.listen(configuration.web.port, configuration.web.host, () => {
  console.log("Server is listening...");
});

export default app;
