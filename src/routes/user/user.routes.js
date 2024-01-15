import {Router} from "express";
import userControllers from "../../controllers/user/user.controllers.js";
import {isLoggedIn} from "../../middlewares/user.middlewares.js";
import { isStudent } from "../../middlewares/admin.middlewares.js";

const router = Router();

router.get("/dashboard", isLoggedIn, isStudent, userControllers.getUserDashboard);
router.post("/dashboard", isLoggedIn, isStudent, userControllers.addVehicle);
router.get("/remove-vehicle", isLoggedIn, isStudent, userControllers.removeVehicle);
router.get("/view-vehicle-details/:licenseNumber", isLoggedIn, isStudent, userControllers.viewVehicleDetails);

export default router;