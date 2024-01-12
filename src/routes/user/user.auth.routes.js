import {Router} from "express";
import userAuthController from "../../controllers/auth/user.auth.controllers.js";
import {isLoggedIn} from "../../middlewares/user/user.middlewares.js";
import passport from "passport";

const router = Router();

router.get("/logout", isLoggedIn, userAuthController.getLogout);
router.get("/auth/google", passport.authenticate("user", {scope: ["profile", "email"]}));
router.get("/auth/google/callback", passport.authenticate("user", {
  successRedirect: "/dashboard",
  failureRedirect: "/",
  failureFlash: true
}));
router.get("/auth/google/failure", userAuthController.getFailure);

export default router;
