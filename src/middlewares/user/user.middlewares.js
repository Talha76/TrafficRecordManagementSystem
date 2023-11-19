import '../../config/oauth.passport.js';

const isloggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
}
const isNotloggedIn = (req, res, next) => {
  !req.user ? next() : res.sendStatus(401);
}

export default {
  isloggedIn,
  isNotloggedIn,
}