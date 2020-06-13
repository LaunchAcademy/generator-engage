import addEnvironmentMiddlewares from "./addEnvironmentMiddlewares.cjs";
<% if(options["sessions-enabled"]) { -%>
import addExpressSession from "./addExpressSession";
<% } -%>

const addMiddlewares = app => {
<% if(options["sessions-enabled"]) { -%>
  addExpressSession(app);
<% } -%>
  addEnvironmentMiddlewares(app);
};

export default addMiddlewares;
