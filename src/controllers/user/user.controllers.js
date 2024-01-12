import * as User from "../../services/User.services.js";
import * as Vehicle from "../../services/Vehicle.services.js";
import {BannedVehicleError, MaxVehicleError, VehicleAlreadyExistsError} from "../../utils/errors.js";

const getUserDashboard = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findUserById(id);
    const vehicles = await Vehicle.getVehicleList(
      {
        userMail: user.email,
      }
    );

    res.render("user/user.dashboard.ejs", {
      user,
      vehicles,
      error: req.flash("error"),
    });
  } catch (err) {
    console.error(err);
  }
};

const addVehicle = async (req, res) => {
  try {
    const {licenseNumber, vehicleName} = req.body;
    const email = req.user.email;
    // const vehicles = await Vehicle.getVehicleList({userMail: email, approvalStatus: true});
    // if (vehicles.length >= parseInt(process.env.MAX_VEHICLE)) {
    //   console.trace(`You can't add more than ${process.env.MAX_VEHICLE} vehicles.`);
    //   req.flash("message", `You can't add more than ${process.env.MAX_VEHICLE} vehicles.`);
    //   return res.redirect("/dashboard");
    // }
    //
    // const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);

    // if (vehicle) {
    //   console.trace("This vehicle is already registered.");
    //   req.flash("message", "This vehicle is already registered.");
    //   return res.redirect("/dashboard");
    // }

    await Vehicle.addVehicle({
      userMail: email,
      licenseNumber: licenseNumber,
      vehicleName: vehicleName
    });
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);

    if (err instanceof MaxVehicleError) {
      req.flash("error", err.message);
    } else if (err instanceof VehicleAlreadyExistsError) {
      req.flash("error", err.message);
    } else if (err instanceof BannedVehicleError) {
      req.flash("error", err.message);
    } else {
      req.flash("message", "An error occurred");
    }
    res.redirect("/dashboard");
  }
};


const removeVehicle = async (req, res) => {
  const {licenseNumber} = req.query;

  try {
    await Vehicle.removeVehicle(licenseNumber);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/dashboard");
  }

};

export default {
  getUserDashboard,
  addVehicle,
  removeVehicle
};
