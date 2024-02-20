export function isAdmin(req, res, next) {
  const user = req.user;
  if (typeof user.designation !== "undefined" && ["sco", "patrol"].includes(user.designation)) {
    return next();
  }
  res.status(401).render("error/401.ejs", {url: "/"});
}

export function isStudent(req, res, next) {
  const user = req.user;
  if (typeof user.designation !== "undefined") {
    res.status(401).render("error/401.ejs", {url: "/"});
  }
  return next();
}

export function isSCO(req, res, next) {
  const user = req.user;
  if (typeof user.designation !== "undefined" && user.designation === "sco") {
    return next();
  }
  res.status(401).render("error/401.ejs", {url: "/"});
}
