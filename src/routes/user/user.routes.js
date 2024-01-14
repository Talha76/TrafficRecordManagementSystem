import {Router} from "express";
import userControllers from "../../controllers/user/user.controllers.js";
import {isLoggedIn} from "../../middlewares/user.middlewares.js";

const router = Router();

router.get("/dashboard", isLoggedIn, userControllers.getUserDashboard);
router.post("/dashboard", isLoggedIn, userControllers.addVehicle);
router.get("/remove-vehicle", isLoggedIn, userControllers.removeVehicle);
router.get("/profile/:userId", isLoggedIn, userControllers.getUserProfile);
router.get("/view-vehicle-logs", isLoggedIn, userControllers.viewVehicleLogs);

export default router;