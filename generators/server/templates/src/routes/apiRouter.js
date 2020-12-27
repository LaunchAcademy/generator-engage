import express from "express";
import v1 from "./api/v1Router.js";

const apiRouter = new express.Router();

apiRouter.use("/v1", v1);

export default apiRouter;
