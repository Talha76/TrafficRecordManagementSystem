import { Router } from 'express';
import userAuthController from '../../controllers/auth/user.auth.controllers.js';
import userMiddlewares from '../../middlewares/user/user.middlewares.js';
const router = Router();
function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('User is already authenticated');
      res.redirect('/dashboard');
    } else {
      console.log('User is not authenticated');
      next();
    }
  }
  
router.get('/login',                userMiddlewares.isNotloggedIn, userAuthController.getLogin);
router.post('/login',               userMiddlewares.isNotloggedIn, userAuthController.postLogin);
router.get('/logout',               userMiddlewares.isloggedIn,    userAuthController.getLogout);
router.get('/auth/google',          checkIfAuthenticated, userAuthController.getScope);
router.get('/auth/google/callback', checkIfAuthenticated, userAuthController.getCallback);
router.get('/auth/google/failure' , userAuthController.getFailure);

export default router;