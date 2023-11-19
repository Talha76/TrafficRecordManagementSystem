import passport from "../../config/oauth.passport.js";

const getScope = passport.authenticate('google', {
  scope: ['email', 'profile']}
);

const getCallback = passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/google/failure',
  failureFlash: true
});

const getLogin = (req, res) => {
  res.render('user/user.login.ejs', {
    error: req.flash('error')
  });
};

const getLogout = (req, res) => {
  req.logout(err => console.error(err));
  res.redirect('/login');
};

const getFailure = (req, res) => {
  req.logout(err => console.trace('Login error:', err));
  req.flash('error', 'Login error');
  res.redirect('/login');
};

export default {
  getLogin,
  getScope,
  getCallback,
  getLogout,
  getFailure,
}