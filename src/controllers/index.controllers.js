const getIndex = (req, res) => {
  res.send('INDEX = <a href="/auth/google">Login with Google</a>');
}

export default {
  getIndex
}
