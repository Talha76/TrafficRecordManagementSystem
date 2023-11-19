import '../../config/oauth.passport.js';

const isloggedIn = (req, res, next) => {
  req.isAuthenticated() === true ? next() : res.sendStatus(401);
}

const isNotloggedIn = (req, res, next) => {
  req.isAuthenticated() === false ? next() : res.sendStatus(401);
}

export {
  isloggedIn,
  isNotloggedIn,
}
