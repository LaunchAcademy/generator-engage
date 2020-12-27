import passport from "passport";
import strategy from "../authentication/passportStrategy.js";
import deserializeUser from "..//authentication/deserializeUser.js";

const addPassport = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(deserializeUser);
export default addPassport;
