import { Router } from 'express';
import userControllers from '../../controllers/user/user.controllers.js';
import userMiddlewares from '../../middlewares/user/user.middlewares.js';

const router = Router();

router.get('/dashboard', userMiddlewares.isloggedIn, userControllers.getUserDashboard);
router.post('/dashboard/add-vehicle', userMiddlewares.isloggedIn, userControllers.addVehicle);
router.get('/dashboard/remove-vehicle', userMiddlewares.isloggedIn, userControllers.removeVehicle);
export default router;