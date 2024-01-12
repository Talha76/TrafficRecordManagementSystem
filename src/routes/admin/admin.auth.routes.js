import {Router} from "express";
import passport from "passport";

const router = Router();

router.get("/auth/google", passport.authenticate("admin", {scope: ["profile", "email"]}));
router.get("/auth/google/callback", passport.authenticate("admin", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/",
  failureFlash: true
}));

export default router;
