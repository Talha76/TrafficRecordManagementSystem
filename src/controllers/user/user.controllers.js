import * as User from "../../services/user.services.js";
import * as Vehicle from "../../services/vehicle.services.js";

const getUserDashboard = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findUserById(id);
    const vehicles = await Vehicle.getVehicleList(
      {
        userMail: user.email,
        deletedAt: null
      }
    );
    req.flash("user", user);

    if(vehicles.length > 0){
      req.flash("vehicles", vehicles);
    }

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

async function viewVehicleLogs (req, res) {
  try{
    const vehicles = await Vehicle.getVehicleList({userMail: req.user.email});
    const logs = [];

    for(const vehicle of vehicles){
      const vehicleLogs = await Vehicle.getVehicleLogs({licenseNumber: vehicle.licenseNumber});
      logs.push(...vehicleLogs);
    }
    req.flash("vehicleLogs", logs);
    res.render("admin/admin.view-logs.ejs", {
      vehicleLogs: req.flash("vehicleLogs")
    });
  }catch(err){
    console.error(err);
  }
};

async function getUserProfile(req, res) {
}

export default {
  viewVehicleLogs,
  getUserProfile,
  getUserDashboard,
  addVehicle,
  removeVehicle
};
