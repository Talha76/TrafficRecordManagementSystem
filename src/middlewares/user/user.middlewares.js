import '../../config/oauth.passport.js';

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).render('error/401.ejs', {url: '/'})
}

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(401).render('error/401.ejs', {url: '/dashboard'});
}

export {
  isLoggedIn,
  isNotLoggedIn,
}
