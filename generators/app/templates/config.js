export default {
  nodeEnv: process.env.NODE_ENV || "development",
  web: {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 3000
  }
};
