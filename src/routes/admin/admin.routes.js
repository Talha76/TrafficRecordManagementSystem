import * as addminController from "../../controllers/admin/admin.controllers.js";


import {Router} from "express";

const router = Router();

// router.get('/', getIndex);
router.get("/dashboard", addminController.getAdminDashboard);
router.post("/dashboard", addminController.postVehicleLogs);
router.post("/add-comment", addminController.addComment);

export default router;
