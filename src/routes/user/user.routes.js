import { Router } from 'express';
import userControllers from '../../controllers/user/user.controllers.js';
import {isloggedIn} from '../../middlewares/user/user.middlewares.js';

const router = Router();

router.get('/dashboard', isloggedIn, userControllers.getUserDashboard);
router.post('/dashboard', isloggedIn, userControllers.addVehicle);
router.get('/dashboard/remove-vehicle', isloggedIn, userControllers.removeVehicle);
export default router;
