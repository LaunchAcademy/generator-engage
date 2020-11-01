import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import clientMiddlewares from "../middlewares/clientMiddlewares.js";
import config from "../config.js";

const router = new express.Router();
const currentPath = dirname(fileURLToPath(import.meta.url));

let indexPath = path.join(currentPath, "../../public/dist/index.html");
if (config.nodeEnv !== "production") {
  indexPath = path.join(currentPath, "../../../client/public/index.html");
}

const clientRoutes = ["/client", "/name"];

router.get(clientRoutes, (req, res) => {
  res.sendFile(indexPath);
});

const middlewares = await clientMiddlewares();
if (middlewares.length > 0) {
  router.use(middlewares);
}

export default router;
