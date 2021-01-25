import "./boot/environments/development.js";
import "./boot/environments/test.js";
<% if(options["e2e"] === "cypress") { %>
import "./boot/environments/e2e.js"
<% } %>

<% if(options["dbClient"] === "objection") { %>
import connection from "./boot/model.cjs";
export { connection }
<% } %>
