const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

require("./src/boot");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Server is listening...");
});

module.exports = app;
