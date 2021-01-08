import express from "express";
import userSessionRouter from "./v1/userSessionsRouter.js";
import usersRouter from "./v1/usersRouter.js";

const v1Router = new express.Router();

v1Router.use("/user-sessions", userSessionRouter);
v1Router.use("/users", usersRouter);

export default v1Router;
