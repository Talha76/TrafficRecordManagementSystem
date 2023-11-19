import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import * as UserServices from "../services/User.services.js";
dotenv.config();

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true,
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      const user = await UserServices.findUserByEmail(profile.email);
      return done(null, user);
    } catch(err) {
      return done(err, false);
    }
  }
);

passport.use('google', googleStrategy);

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const newUser = await UserServices.findUserByEmail(user.email);
  done(null, newUser);
});

export default passport;
