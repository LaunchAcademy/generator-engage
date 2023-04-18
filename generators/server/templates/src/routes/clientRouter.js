import express from "express";
import getClientIndexPath from "../config/getClientIndexPath.js";

const router = new express.Router();

<% if(options["authentication"] === "passport") { -%>
const clientRoutes = ["/", "/user-sessions/new", "/users/new"];
const authedClientRoutes = ["/profile"];

router.get(authedClientRoutes, (req, res) => {
  if (req.user) {
    res.sendFile(getClientIndexPath());
  } else {
    res.redirect("/user-sessions/new")
  }
});

<% } else { -%>
const clientRoutes = ["/client", "/name"];
<% } -%>
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath());
});

export default router;
