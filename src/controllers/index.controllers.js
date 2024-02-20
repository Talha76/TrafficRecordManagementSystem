const getIndex = (req, res) => {
  res.render("user/user.login.ejs", {
    success: req.flash("success"),
    error: req.flash("error")
  });
};

export default {
  getIndex
};
