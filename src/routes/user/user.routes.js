import { Router } from 'express';
import userControllers from '../../controllers/user/user.controllers.js';
import {isLoggedIn} from '../../middlewares/user/user.middlewares.js';

const router = Router();

router.get('/dashboard', isLoggedIn, userControllers.getUserDashboard);
router.post('/dashboard', isLoggedIn, userControllers.addVehicle);
router.get('/dashboard/remove-vehicle', isLoggedIn, userControllers.removeVehicle);

export default router;
