import {Router} from "express";
import indexControllers from "../controllers/index.controllers.js";
import {isNotLoggedIn} from "../middlewares/user/user.middlewares.js";

const route = Router();

route.get("/", isNotLoggedIn, indexControllers.getIndex);

export default route;