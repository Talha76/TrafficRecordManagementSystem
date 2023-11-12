import passport from 'passport';
import dotenv from 'dotenv';
import { Request } from 'express'; // Assuming you're using Express
import User from '../../models/User.class.js';
import bcrypt from 'bcryptjs';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth2';
dotenv.config();

const googleStrategy = new GoogleStrategy( {
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
