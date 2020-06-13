export default {
  nodeEnv: process.env.NODE_ENV || "development",
<% if(options["sessions-enabled"]) { -%>
  session: { secret: process.env.SESSION_SECRET },
<% } -%>
  web: { host: process.env.HOST || "0.0.0.0", port: process.env.PORT || 3000 }
};
