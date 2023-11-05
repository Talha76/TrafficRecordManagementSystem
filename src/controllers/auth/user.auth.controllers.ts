import passport from "../../config/auth/oauth.passport.js";

// These two are to be variables for the respected routes
const getScope = passport.authenticate('google', { scope: ['email', 'profile'] });

const getCallback =  passport.authenticate('google', {
            successRedirect: '/dashboard',
            failureRedirect: 'auth/google/failure',
            successFlash: true,
            failureFlash: true
        }); 

const getLogin = (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>');
};


const postLogin = (req, res) => {
    res.send('login');
};

const getLogout =  (req, res) => {
    req.logout(function(err) {
      if (err) {
        console.error(err);
      }
      res.redirect('/');
    });
};

const getFailure = (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error(err);
        }
        res.send('USER NOT FOUND!!! Go to dashboard and try again <a href="/">dashboard</a>');
    })
    // res.send('failure <a href="/logout">Logout</a>');
};

export default {
    getLogin,
    postLogin,
    getScope,
    getCallback,
    getLogout,
    getFailure,
}