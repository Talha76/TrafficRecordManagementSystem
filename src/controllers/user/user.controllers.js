import * as User from "../../services/User.services.js";
import * as Vehicle from "../../services/Vehicle.services.js";

const getUserDashboard = async (req, res) => {
  let _mail = req.user.email;
  try {
    const user = await User.findUserByEmail(_mail);
    const vehicles = await Vehicle.getVehicleList(
      {
        userMail: _mail,
        approvalStatus: true,
      }
    );

    res.render('user/user.dashboard.ejs', {
      user,
      vehicles
    });
  } catch (err) {
    console.error(err);
  }
}

const addVehicle = async (req, res) => {

  const {licenseNumber, vehicleName} = req.body;
  const _mail = req.user.email;
  try {
    const vehicles = await Vehicle.getVehicleList({userMail: _mail, approvalStatus: true});
    if (vehicles.length >= parseInt(process.env.MAX_VEHICLE)) {
      req.flash('message', `You can't add more than ${process.env.MAX_VEHICLE} vehicles.`);
      return res.redirect('/dashboard');
    }

    const vehicle = await Vehicle.getVehicleList({
      licenseNumber: licenseNumber,
      approvalStatus: true
    });
    if (vehicle) {
      req.flash('message', `This vehicle is already registered.`);
      return res.redirect('/dashboard');
    }

    await Vehicle.addVehicle({
      userMail: _mail,
      licenseNumber: licenseNumber,
      vehicleName: vehicleName
    });
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('message', 'An error occurred');
    return res.redirect('/dashboard');
  }
};


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
