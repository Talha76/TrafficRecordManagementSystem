import * as adminController from "../../controllers/admin/admin.controllers.js";
import {isLoggedIn} from "../../middlewares/user.middlewares.js";
import {isAdmin} from "../../middlewares/admin.middlewares.js";
import {Router} from "express";

const router = Router();

router.get("/dashboard", isLoggedIn, isAdmin, adminController.getAdminDashboard);
router.post("/dashboard", isLoggedIn, isAdmin, adminController.postVehicleLogs);
router.post("/add-comment", isLoggedIn, isAdmin, adminController.addComment);
router.get("/view-vehicle-logs", isLoggedIn, isAdmin, adminController.viewVehicleLogs);

router.get("/view-vehicle-details/:licenseNumber", isLoggedIn, isAdmin, adminController.viewVehicleDetails);
router.get("/view-user-details/:userId", isLoggedIn, isAdmin, adminController.viewUserDetails);
router.post("/change-duration/:licenseNumber", isLoggedIn, isAdmin, adminController.changeDuration);
router.get("/ban/:licenseNumber", isLoggedIn, isAdmin, adminController.banVehicle);
router.get("/unban/:licenseNumber", isLoggedIn, isAdmin, adminController.unbanVehicle);

router.get('/get-approval', adminController.getApproval);
router.get('/approve/:licenseNumber', adminController.approve);
router.get('/get-approval', adminController.getApproval);
router.get('/approve/:licenseNumber', adminController.approve);

export default router;
