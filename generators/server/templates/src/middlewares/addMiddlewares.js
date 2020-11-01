import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.js";
<% if(options["sessionsEnabled"]) { -%>
import addExpressSession from "./addExpressSession.js";
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
import addDbMiddleware from "./addDbMiddleware.js";
<% } -%>

const addMiddlewares = async app => {
<% if(options["sessionsEnabled"]) { -%>
  addExpressSession(app);
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
  addDbMiddleware(app);
<% } -%>
  await addEnvironmentMiddlewares(app);
};

export default addMiddlewares;
