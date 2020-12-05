import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.js";
<% if(options["sessionsEnabled"]) { -%>
import addExpressSession from "./addExpressSession.js";
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
import addDbMiddleware from "./addDbMiddleware.js";
<% } -%>
<% if(options["clientAppPath"]) { -%>
import addClientMiddlewares from "./addClientMiddlewares.js";
<% } -%>

const addMiddlewares = async app => {
<% if(options["sessionsEnabled"]) { -%>
  addExpressSession(app);
<% } -%>
<% if(options["dbClient"] === "pg") { -%>
  addDbMiddleware(app);
<% } -%>
<% if(options["clientAppPath"]) { -%>
  await addClientMiddlewares(app);
<% } -%>
  await addEnvironmentMiddlewares(app);
};

export default addMiddlewares;
