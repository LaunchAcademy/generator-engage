import getNodeEnv from "./config/getNodeEnv.js";
<% if(options["dbClient"] !== "") { -%>
import getDatabaseUrl from "./config/getDatabaseUrl.cjs";
<% } -%>

export default {
  nodeEnv: getNodeEnv(),
<% if(options["sessionsEnabled"]) { -%>
  session: { secret: process.env.SESSION_SECRET },
<% } -%>
<% if(options["dbClient"] !== "") { -%>
  databaseUrl: getDatabaseUrl(getNodeEnv()),
<% } -%>
  web: { host: process.env.HOST || "0.0.0.0", port: process.env.PORT || 3000 }
};
