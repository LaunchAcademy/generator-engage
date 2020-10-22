import "./boot/environments/development.js";
import "./boot/environments/test.js";

<% if(options["db-client"] === "objection") { %>
import connection from "./boot/model.js";
export { connection }
<% } %>
