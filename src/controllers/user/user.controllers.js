import * as User from "../../services/user.services.js";
import * as Vehicle from "../../services/vehicle.services.js";

const getUserDashboard = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findUserById(id);
    const vehicles = await Vehicle.getVehicleList(
      {
        userMail: user.email,
      }
    );

    req.flash("user", user);
    req.flash("vehicles", vehicles);
    res.render("user/user.dashboard.ejs", {
      user: req.flash("user"),
      vehicles: req.flash("vehicles"),
      error: req.flash("error"),
      success: req.flash("success")
    });
  } catch (err) {
    console.error(err);
  }
};

const addVehicle = async (req, res) => {
  try {
    const {licenseNumber, vehicleName} = req.body;
    const email = req.user.email;
    await Vehicle.addVehicle({
      userMail: email,
      licenseNumber: licenseNumber,
      vehicleName: vehicleName
    });
    req.flash("success", "Vehicle added successfully");
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    res.redirect("/dashboard");
  }
};


const removeVehicle = async (req, res) => {
  const {licenseNumber} = req.query;

  try {
    await Vehicle.removeVehicle(licenseNumber);
    req.flash("success", "Vehicle removed successfully");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/dashboard");
  }

};

async function getUserProfile(req, res) {
}

export default {
  getUserProfile,
  getUserDashboard,
  addVehicle,
  removeVehicle
};
