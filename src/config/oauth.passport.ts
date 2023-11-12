import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth2';

require('dotenv').config();

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true,
  },
  (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
);

passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
