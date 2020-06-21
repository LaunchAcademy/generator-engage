import session from "express-session";
import configuration from "../config.js";

const addExpressSession = app => {
  app.use(
    session({
      secret: configuration.session.secret,
      resave: true,
      saveUninitialized: true
    })
  );
};

export default addExpressSession;
