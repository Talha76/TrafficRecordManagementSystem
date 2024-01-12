import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import {findAdminByEmail} from "../../services/admin.services.js";
import dotenv from "dotenv";

dotenv.config();

export default function initializeAdminStrategy(passport) {
  passport.use("admin", new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/admin/auth/google/callback"
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
