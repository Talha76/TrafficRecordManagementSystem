import User from "../../services/User.class.js";
import Vehicle from "../../services/Vehicle.class.js";

const getUserDashboard = async (req, res) => {
  let _mail = req.user.email;
  let user = new User({
    mail: _mail
  });
  await user.fetch();

  res.render('user/user.dashboard.ejs', {"user": user});
}

const addVehicle = async (req, res) => {
  const {licenseNumber, vehicleName} = req.body;
  let vehicle = new Vehicle({
    licenseNumber: licenseNumber,
    userMail: req.user.email,
    vehicleName: vehicleName,
    allowedDuration: 20,
    approvalStatus: false,
  });

  const _mail = req.user.email;
  const user = new User({
    mail: _mail
  });
  await user.fetch();
  try {
    user.addVehicle(vehicle);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }
}

const removeVehicle = async (req, res) => {
  const {vehicleName, licenseNumber} = req.query;

  console.log('Removing vehicle with Name:', vehicleName, 'and License Number:', licenseNumber);

  const _mail = req.user.email;
  const user = new User({
    mail: _mail
  });
  await user.fetch();

  const vehicle = new Vehicle({
    licenseNumber: licenseNumber,
  });
  await vehicle.fetch();
  try {
    user.removeVehicle(vehicle);
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
};


export default {
  getUserDashboard,
  addVehicle,
  removeVehicle
}