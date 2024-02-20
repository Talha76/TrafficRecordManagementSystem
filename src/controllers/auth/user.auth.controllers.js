const getLogout = (req, res) => {
  req.logout(() => {
  });
  res.redirect("/");
};

export default {
  getLogout,
};