import * as adminController from "../../controllers/admin/admin.controllers.js";
import {isLoggedIn} from "../../middlewares/user.middlewares.js";
import {isAdmin, isSCO} from "../../middlewares/admin.middlewares.js";
import {Router} from "express";

const router = Router();

router.get("/", isLoggedIn, isAdmin, adminController.getAdminDashboard);
router.get("/dashboard", isLoggedIn, isAdmin, adminController.getAdminDashboard);
router.post("/dashboard", isLoggedIn, isAdmin, adminController.postVehicleLogs);
router.post("/add-comment", isLoggedIn, isAdmin, adminController.addComment);
router.get("/view-vehicle-details", isLoggedIn, isAdmin, adminController.viewVehicleDetails);
router.post("/extend-duration", isLoggedIn, isAdmin, adminController.extendDuration);
router.get("/view-vehicle-logs", isLoggedIn, isAdmin, adminController.viewVehicleLogs);

router.get("/view-vehicle-details/:licenseNumber", isLoggedIn, isAdmin, adminController.viewVehicleDetails);
router.get("/view-user-details/:userId", isLoggedIn, isAdmin, adminController.viewUserDetails);
router.post("/change-duration/:licenseNumber", isLoggedIn, isAdmin, adminController.changeDuration);
router.get("/ban/:licenseNumber", isLoggedIn, isAdmin, adminController.banVehicle);
router.get("/unban/:licenseNumber", isLoggedIn, isAdmin, adminController.unbanVehicle);

router.get("/get-approval", isLoggedIn, isAdmin, adminController.getApproval);
router.get("/approve/:licenseNumber", isLoggedIn, isAdmin, adminController.approve);
router.post("/approve", isLoggedIn, isAdmin, adminController.approve);
router.post("/reject", isLoggedIn, isAdmin, adminController.reject);
router.get("/generate-report", isLoggedIn, isAdmin,isSCO,adminController.getGenerateReport);
router.post("/generate-report", isLoggedIn, isAdmin,isSCO, adminController.generateReport);

router.post("/get-approval", isLoggedIn, isAdmin, adminController.postApproval);
export default router;