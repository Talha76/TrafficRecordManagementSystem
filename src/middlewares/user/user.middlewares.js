import '../../config/oauth.passport.js';
import * as User from '../../services/User.services.js';

const emailVerificationMiddleware = async (req, res, next) => {
  const _email = req.user.email;
  console.log("fetching by mail = " + _email);
  const user = await User.findUserByEmail(_email);
  if (user) next();
  else res.redirect('/auth/google/failure');
}

const isloggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
}
const isNotloggedIn = (req, res, next) => {
  !req.user ? next() : res.sendStatus(401);
}

export default {
  isloggedIn,
  isNotloggedIn,
  emailVerificationMiddleware
}