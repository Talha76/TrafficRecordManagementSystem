import * as User from "../../services/User.services.js";
import * as Vehicle from "../../services/Vehicle.services.js";

const getUserDashboard = async (req, res) => {
  let _mail = req.user.email;
  try {
    const user = await User.findUserByEmail(_mail);
    const vehicles = await Vehicle.getVehicleList({userMail: _mail});

    req.flash('user', user);
    req.flash('vehicles', vehicles);
    res.render('user/user.dashboard.ejs', {
      user: req.flash('user'),
      vehicles: req.flash('vehicles'),
    });
  } catch (err) {
    console.error(err);
  }
}

const addVehicle = async (req, res) => {
  const {licenseNumber, vehicleName} = req.body;
  const _mail = req.user.email;
  try {
    await Vehicle.addVehicle({
      userMail: _mail,
      licenseNumber: licenseNumber,
      vehicleName: vehicleName
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }
}

const removeVehicle = async (req, res) => {
  const {licenseNumber} = req.query;

  try {
    await Vehicle.removeVehicle(licenseNumber);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
  }

};


export default {
  getUserDashboard,
  addVehicle,
  removeVehicle
}
