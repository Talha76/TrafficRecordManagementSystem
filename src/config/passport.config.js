import passport from "passport";
import initializeUserStrategy from "./strategies/user.strategy.js";
import initializeAdminStrategy from "./strategies/admin.strategy.js";
import {findUserByEmail} from "../services/user.services.js";
import {findAdminByEmail} from "../services/admin.services.js";

export default function initializePassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  initializeUserStrategy(passport);
  initializeAdminStrategy(passport);

  passport.serializeUser((user, done) => {
    try {
      let role;
      if (typeof user.designation !== "undefined" && ["sco", "patrol"].includes(user.designation)) {
        role = "admin";
      } else {
        role = "user";
      }
      done(null, {
        email: user.email,
        role
      });
    } catch (err) {
      done(err, false);
    }
  });

  passport.deserializeUser(async (user, done) => {
    try {
      let usr;
      if (user.role === "user") {
        user = await findUserByEmail(user.email);
      } else {
        user = await findAdminByEmail(user.email);
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
}
