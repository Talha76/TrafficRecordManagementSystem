import * as Vehicle from "../../services/vehicle.services.js";
import * as User from "../../services/user.services.js";
import {findVehiclesStayingUpto} from "../../services/admin.services.js";

// YYYY-MM-DD HH:MM:SS
const getAdminDashboard = async (req, res) => {
  try {
    const vehiclesStayingCurrently = await findVehiclesStayingUpto(new Date());

    const flashVehicleLogs = [];
    for (const {id, licenseNumber, entryTime, comment} of vehiclesStayingCurrently) {
      const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
      const user = await User.findUserByEmail(vehicle.userMail);

      const timeOfEntry = entryTime.toISOString().split("T")[1].split(".")[0]
        + " " + entryTime.toISOString().split("T")[0];

      flashVehicleLogs.push({
        id,
        licenseNumber,
        entryTime: timeOfEntry,
        comment,
        userId: user.id,
        phoneNumber: user.phoneNumber
      });
    }

    req.flash("vehicleLogs", flashVehicleLogs);
    res.render("./admin/admin.dashboard.ejs", {
      vehicleLogs: req.flash("vehicleLogs")
    });
  } catch (err) {
    console.error(err);
  }
};

const postVehicleLogs = async (req, res) => {
  try {
    const licenseNumber = req.body.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      return res.redirect("/admin/dashboard");
    }

    const vehicleLogs = await Vehicle.getVehicleLogs(
      {
        licenseNumber: licenseNumber,
        exitTimeEqual: null,
      }
    );
    if (vehicleLogs && vehicleLogs.length > 0 && vehicleLogs[0].id) {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 6);
      const exitTime = currentTime;
      const vehicleLog = await Vehicle.updateVehicleLog({
        id: vehicleLogs[0].id,
        exitTime
      });
      if (vehicleLog) {
        res.redirect("/admin/dashboard");
      }
    } else {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 6);
      const entryTime = currentTime;
      const vehicleLog = await Vehicle.addVehicleLog({licenseNumber, entryTime});
      if (vehicleLog) {
        res.redirect("/admin/dashboard");
      }
    }
  } catch (err) {
    console.error(err);
  }
};


const addComment = async (req, res) => {
  try {
    const {logId, comment} = req.body;
    const vehicleLog = await Vehicle.findVehicleLogById(logId);
    if (vehicleLog === null) {
      return res.redirect("/admin/dashboard");
    }
    const vehicleLogUpdated = await Vehicle.updateVehicleLog({
      id: vehicleLog.id,
      comment
    });
    if (vehicleLogUpdated) {
      res.redirect("/admin/dashboard");
    }

  } catch (err) {
    console.error(err);
  }
};


export {
  getAdminDashboard,
  postVehicleLogs,
  addComment
};
