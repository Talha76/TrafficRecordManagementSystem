const getLogout = (req, res) => {
  req.logout(() => {
  });
  res.redirect("/");
};

const getFailure = (req, res) => {
  res.send("USER NOT FOUND!!! Go to dashboard and try again <a href=\"/\">frontPage</a><br>Error: " + req.flash("error")[0]);
};

export default {
  getLogout,
  getFailure
};