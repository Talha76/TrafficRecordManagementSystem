import passport from "../../config/oauth.passport.js";

const getScope = passport.authenticate("google", {
  scope: ["email", "profile"]}
);

const getCallback = passport.authenticate("google", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth/google/failure",
  successFlash: true,
  failureFlash: true
});

const getLogout = (req, res) => {
  req.logout(err => console.error(err));
  res.redirect("/");
};

const getFailure = (req, res) => {
  res.send("USER NOT FOUND!!! Go to dashboard and try again <a href=\"/\">frontPage</a>");
};

export default {
  getScope,
  getCallback,
  getLogout,
  getFailure
};