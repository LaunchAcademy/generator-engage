import "./boot/environments/development.js";
import "./boot/environments/test.js";

<% if(options["db-client"] === "objection") { %>
import "./boot/model.js";
<% } %>
