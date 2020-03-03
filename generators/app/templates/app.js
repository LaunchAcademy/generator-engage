const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const addEnvironmentMiddlewares = require("./src/middlewares/addEnvironmentMiddlewares");
const configuration = require("./config");

require("./src/boot");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

addEnvironmentMiddlewares(app);

app.listen(configuration.web.port, configuration.web.host, () => {
  console.log("Server is listening...");
});

module.exports = app;
