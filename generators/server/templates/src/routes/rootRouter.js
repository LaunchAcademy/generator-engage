import express from "express";
<% if(options["authentication"] === "passport") { -%>
import userSessionsRouter from "./api/v1/userSessionsRouter.js"
import usersRouter from "./api/v1/usersRouter.js"
<% } -%>

const rootRouter = new express.Router();

<% if(options["authentication"] === "passport") { -%>
rootRouter.use("/api/v1/user-sessions", userSessionsRouter)
rootRouter.use("/api/v1/users", usersRouter)
<% } -%>

//place your server-side routes here

export default rootRouter;
