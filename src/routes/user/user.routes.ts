import { Router } from 'express';
import userControllers from '../../controllers/user/user.controllers.js';
import userMiddlewares from '../../middlewares/user/user.middlewares.js';
const router = Router();

router.get('/dashboard', userMiddlewares.isloggedIn, userMiddlewares.emailVerificationMiddleware, userControllers.getUserDashboard);
router.post('/dashboard', userMiddlewares.isloggedIn, userControllers.addVehicle);
router.get('/dashboard/removeVehicle', userMiddlewares.isloggedIn, userControllers.removeVehicle);
export default router;