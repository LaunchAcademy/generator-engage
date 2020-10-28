import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.js";
<% if(options["sessionsEnabled"]) { -%>
import addExpressSession from "./addExpressSession.js";
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
import addDbMiddleware from "./addDbMiddleware.js";
<% } -%>

const addMiddlewares = app => {
<% if(options["sessionsEnabled"]) { -%>
  addExpressSession(app);
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
  addDbMiddleware(app);
<% } -%>
  addEnvironmentMiddlewares(app);
};

export default addMiddlewares;
