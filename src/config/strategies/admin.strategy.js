import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import {findAdminByEmail} from "../../services/admin.services.js";
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
        const user = await findAdminByEmail(profile.email);
        if (!user) {
          return done(null, false, {message: "Admin not found"});
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  ));
}
