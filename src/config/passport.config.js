import passport from "passport";
import initializeUserStrategy from "./strategies/user.strategy.js";

export default function initializePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  initializeUserStrategy(passport);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
