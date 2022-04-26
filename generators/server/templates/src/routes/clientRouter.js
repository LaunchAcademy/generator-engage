import express from "express";
import getClientIndexPath from "../config/getClientIndexPath.js";

const router = new express.Router();

<% if(options["authentication"] === "passport") { -%>
const clientRoutes = ["/", "/user-sessions/new", "/users/new"];
const authedClientRoutes = ["/authed-path"]
<% } else { -%>
const clientRoutes = ["/client", "/name"];
<% } -%>
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath());
});

<% if(options["authentication"] === "passport") { -%>
router.get(authedClientRoutes, (req, res) => {
  if (req.user) {
    res.sendFile(getClientIndexPath());
  } else {
    res.redirect("/user-sessions/new")
  }
});
<% } -%>

export default router;
