import User from '../models/User.class.js';

async function getIndex(req, res) {
  const user = new User({
    mail : 'shahrier@iut-dhaka.edu',
  });

  await user.fetch();
  if(user) {
    console.log(user);
  } else
    console.log('No user found');
  res.redirect('/admin');
}

export {
  getIndex
};

