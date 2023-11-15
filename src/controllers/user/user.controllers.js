import * as User from "../../services/User.services.js";
import * as Vehicle from "../../services/Vehicle.services.js";

const getUserDashboard = async (req, res) => {
  let _mail = req.user.email;
  try {
    const user = await User.findUserByEmail(_mail);
    const vehicles = await Vehicle.getVehicleList({userMail: _mail});
    res.render('user/user.dashboard.ejs', {
      "user": user,
      "vehicles": vehicles
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

  console.log('Removing vehicle with License Number:', licenseNumber);

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