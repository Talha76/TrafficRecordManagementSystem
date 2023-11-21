import { Router } from 'express';
import userAuthController from '../../controllers/auth/user.auth.controllers.js';
import {isLoggedIn} from '../../middlewares/user/user.middlewares.js';

const router = Router();

router.get('/logout', isLoggedIn, userAuthController.getLogout);
router.get('/auth/google', userAuthController.getScope);
router.get('/auth/google/callback', userAuthController.getCallback);
router.get('/auth/google/failure', userAuthController.getFailure);

export default router;
