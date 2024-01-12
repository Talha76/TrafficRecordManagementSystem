import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import {findUserByEmail} from "../../services/User.services.js";
import dotenv from "dotenv";

dotenv.config();

export default function initializeUserStrategy(passport) {
  passport.use("user", new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email;
        const mailDomain = email.slice(email.indexOf("@") + 1);
        if (mailDomain !== process.env.MAIL_DOMAIN) {
          return done(null, false, {message: `Please provide user mail with ${process.env.MAIL_DOMAIN} domain`});
        }
        const user = await findUserByEmail(profile.email);
        if (!user) {
          return done(null, false, {message: "User not found"});
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  ));
}
