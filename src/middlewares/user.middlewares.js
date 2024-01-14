const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).render("error/401.ejs", {url: "/"});
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (typeof req.user.id === "undefined") {
    return res.redirect("/admin/dashboard");
  }
  res.redirect("/dashboard");
};

export {
  isLoggedIn,
  isNotLoggedIn,
};
