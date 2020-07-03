import getNodeEnv from "./config/getNodeEnv.js";
<% if(options["db-client"] !== "") { -%>
import getDatabaseUrl from "./config/getDatabaseUrl.js";
<% } -%>

export default {
  nodeEnv: getNodeEnv(),
<% if(options["sessions-enabled"]) { -%>
  session: { secret: process.env.SESSION_SECRET },
<% } -%>
<% if(options["db-client"] !== "") { -%>
  databaseUrl: getDatabaseUrl(getNodeEnv()),
<% } -%>
  web: { host: process.env.HOST || "0.0.0.0", port: process.env.PORT || 3000 }
};
