import "./boot/environments/development.js";
import "./boot/environments/test.js";

<% if(options["dbClient"] === "objection") { %>
import connection from "./boot/model.js";
export { connection }
<% } %>
