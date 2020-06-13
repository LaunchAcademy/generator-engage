import getNodeEnv from "./config/getNodeEnv.js";

export default {
  nodeEnv: getNodeEnv(),
<% if(options["sessions-enabled"]) { -%>
  session: { secret: process.env.SESSION_SECRET },
<% } -%>
  web: { host: process.env.HOST || "0.0.0.0", port: process.env.PORT || 3000 }
};
