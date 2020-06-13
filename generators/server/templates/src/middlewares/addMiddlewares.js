import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.js";
<% if(options["sessions-enabled"]) { -%>
import addExpressSession from "./addExpressSession.js";
<% } -%>

const addMiddlewares = app => {
<% if(options["sessions-enabled"]) { -%>
  addExpressSession(app);
<% } -%>
  addEnvironmentMiddlewares(app);
};

export default addMiddlewares;