// import '../../config/oauth.passport.js';
// import * as Admin from "../services/Admin.services.js";
//
// const emailVerificationMiddleware = async (req, res, next) => {
//   const _email = req.user.email;
//   console.log("fetching by mail = " + _email);
//   const admin = await Admin.findAdminByEmail(_email);
//   if (admin) next();
//   else res.redirect('/auth/google/failure');
// }
// const isloggedIn = (req, res, next) => {
//   req.user ? next() : res.sendStatus(401);
// }
// const isNotloggedIn = (req, res, next) => {
//   !req.user ? next() : res.sendStatus(401);
// }
//
// export {
//   isloggedIn,
//   isNotloggedIn,
//   emailVerificationMiddleware
// }