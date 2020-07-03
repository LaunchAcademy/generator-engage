import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.js";
<% if(options["sessions-enabled"]) { -%>
import addExpressSession from "./addExpressSession.js";
<% } -%>
<% if(options["db-client"] === "pg") { -%>
import addDbMiddleware from "./addDbMiddleware.js";
<% } -%>

const addMiddlewares = app => {
<% if(options["sessions-enabled"]) { -%>
  addExpressSession(app);
<% } -%>
<% if(options["db-client"] === "pg") { -%>
  addDbMiddleware(app);
<% } -%>
  addEnvironmentMiddlewares(app);
};

export default addMiddlewares;
