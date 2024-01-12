import * as Vehicle from "../../services/Vehicle.services.js";
import * as User from "../../services/User.services.js";

// YYYY-MM-DD HH:MM:SS
const getAdminDashboard = async (req, res) => {
  try {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 6);

    const currentDate = new Date();
    currentDate.setHours(6, 0, 0, 0);
    const vehicleLogs = await Vehicle.getVehicleLogs(
      {
        entryTimeTo: currentTime,
        exitTimeEqual: null,
      }
    );

    const flashVehicleLogs = [];
    for (const vehicleLog of vehicleLogs) {
      const {id, licenseNumber, entryTime, comment} = vehicleLog;
      const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
      console.trace(licenseNumber, vehicle);
      const user = await User.findUserByEmail(vehicle.userMail);

      const timeOfEntry = entryTime.toISOString().split("T")[1].split(".")[0];

      flashVehicleLogs.push({
        id,
        licenseNumber,
        entryTime: timeOfEntry,
        comment,
        userId: user.id,
        phoneNumber: user.phoneNumber
      });
    }

    res.render("./admin/admin.dashboard.ejs", {
      "vehicleLogs": flashVehicleLogs
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
