const getIndex = (req, res) => {
  res.render('user/user.login.ejs', {
    message: req.flash('message'),
    error: req.flash('error')
  });
}

export default {
  getIndex
}
