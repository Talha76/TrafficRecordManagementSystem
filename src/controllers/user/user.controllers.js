import * as User from "../../services/user.services.js";
import * as Vehicle from "../../services/vehicle.services.js";
import {printableDateTime} from "../../utils/utility.js";

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
    user.designation = "User";
    console.log(user.dataValues, user.designation);

    req.flash("user", user);
    if (vehicles.length > 0) {
      req.flash("vehicles", vehicles);
    }

    res.render("user/user.dashboard.ejs", {
      user: req.flash("user")[0],
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

async function viewVehicleDetails(req, res) {
  try {
    const {licenseNumber} = req.params;

    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    const logs = await Vehicle.getVehicleLogs({licenseNumber});

    const flashLogs = [];
    for (const {entryTime, exitTime, comment, lateDuration} of logs) {
      flashLogs.push({
        entryTime: printableDateTime(entryTime),
        exitTime: exitTime === null ? "Not Exited" : printableDateTime(exitTime),
        comment: comment,
        lateDuration
      });
    }

    if (flashLogs.length > 0) req.flash("vehicleLogs", flashLogs);
    req.flash("vehicle", vehicle);
    const user = req.user;
    user.designation = "User";
    req.flash("user", user);
    req.flash("appUser", user);
    res.render("admin/carDetails.ejs", {
      vehicleLogs: req.flash("vehicleLogs"),
      vehicle: req.flash("vehicle")[0],
      user: req.flash("user")[0],
      appUser: req.flash("appUser")[0],
      error: req.flash("error"),
      success: req.flash("success")
    });
  } catch (err) {
    console.error(err);
  }
};

export default {
  viewVehicleDetails,
  getUserDashboard,
  addVehicle,
  removeVehicle
};
