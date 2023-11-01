import { Router } from 'express';
import userAuthController from '../../controllers/auth/user.auth.controllers.js';
import userMiddlewares from '../../middlewares/user/user.middlewares.js';
const router = Router();

router.get('/login',                userMiddlewares.isNotloggedIn, userAuthController.getLogin);
router.post('/login',               userMiddlewares.isNotloggedIn, userAuthController.postLogin);
router.get('/logout',               userMiddlewares.isloggedIn,    userAuthController.getLogout);
router.get('/protected',            userMiddlewares.isloggedIn, userMiddlewares.emailVerificationMiddleware, userAuthController.getProtected);
router.get('/auth/google',          userMiddlewares.isNotloggedIn, userAuthController.getScope);
router.get('/auth/google/callback', userAuthController.getCallback);
router.get('/auth/google/failure' , userAuthController.getFailure);

export default router;