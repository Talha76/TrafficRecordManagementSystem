import {Router} from "express";
import userControllers from "../../controllers/user/user.controllers.js";
import {isLoggedIn} from "../../middlewares/user/user.middlewares.js";

const router = Router();

router.get("/", isLoggedIn, userControllers.getUserDashboard);
router.post("/", isLoggedIn, userControllers.addVehicle);
router.get("/remove-vehicle", isLoggedIn, userControllers.removeVehicle);

export default router;
