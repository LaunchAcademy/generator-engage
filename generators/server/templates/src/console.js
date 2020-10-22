import repl from "repl";
import { connection } from "./boot.js";

import models from "./models/index.js";

const replServer = repl.start({
  prompt: "> ",
});

replServer.context.models = models;
replServer.on("close", () => {
  connection.destroy();
});
