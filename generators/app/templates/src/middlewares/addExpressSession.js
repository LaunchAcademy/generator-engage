import configuration from "../../config/index.js";
import session from "express-session";

const addExpressSession = app => {
  app.use(
    session({
      secret: configuration.session.secret
    })
  );
};

export default addExpressSession;
