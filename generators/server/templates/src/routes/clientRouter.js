import express from "express";
import getClientIndexPath from "../config/getClientIndexPath.js";

const router = new express.Router();

<% if(options["authentication"] === "passport") { -%>
const clientRoutes = ["/", "/user-sessions/new", "/users/new"];
<% } else { -%>
const clientRoutes = ["/client", "/name"];
<% } -%>
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath());
});

export default router;
