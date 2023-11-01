import '../../config/auth/oauth.passport.js';
import User from '../../models/User.class.js';
const emailVerificationMiddleware  = async (req, res, next) => {
    const _email = req.user.email;
    console.log(_email);
    let user = new User({
        mail : _email
    });
    const isUserAvailable = await user.fetch();
    if(isUserAvailable) next();
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