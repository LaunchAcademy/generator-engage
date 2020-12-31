import express from "express";
<% if(options["authentication"] === "passport") { -%>
import apiRouter from "./apiRouter.js";
<% } -%>

const rootRouter = new express.Router();

<% if(options["authentication"] === "passport") { -%>
rootRouter.use(apiRouter)
<% } -%>

//place your server-side routes here

export default rootRouter;
