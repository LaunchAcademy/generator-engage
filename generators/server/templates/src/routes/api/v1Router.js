import express from "express";
import userSessionRouter from "./v1/userSessionsRouter.js";

const v1Router = new express.Router();

v1Router.use("/user-sessions", userSessionRouter);

export default v1Router;
