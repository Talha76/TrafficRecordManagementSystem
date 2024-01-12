export function isAdmin(req, res, next) {
  const user = req.user;
  if (typeof user.designation !== "undefined" && ["sco", "patrol"].includes(user.designation)) {
    return next();
  }
  res.status(401).render("error/401.ejs", {url: "/"});
}
