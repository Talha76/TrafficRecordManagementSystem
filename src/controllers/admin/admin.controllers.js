import * as Vehicle from "../../services/vehicle.services.js";
import * as User from "../../services/user.services.js";
import {findVehiclesStayingUpto} from "../../services/admin.services.js";
import {BannedVehicleError} from "../../utils/errors.js";
import {zip} from "../../utils/utility.js";

// YYYY-MM-DD HH:MM:SS
const getAdminDashboard = async (req, res) => {
  try {
    const vehiclesStayingCurrently = await findVehiclesStayingUpto(new Date());

    const vehiclePromises = [];
    const flashVehicleLogs = [];
    for (const {licenseNumber} of vehiclesStayingCurrently) {
      vehiclePromises.push(Vehicle.findVehicleByLicenseNumber(licenseNumber));
    }
    const vehicles = await Promise.all(vehiclePromises);

    const userPromises = [];
    for (const {userMail} of vehicles) {
      userPromises.push(User.findUserByEmail(userMail));
    }
    const users = await Promise.all(userPromises);

    for (const [user, log] of zip([users, vehiclesStayingCurrently])) {
      const {id, entryTime, licenseNumber, comment} = log;
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
      vehicleLogs: req.flash("vehicleLogs"),
      error: req.flash("error"),
      success: req.flash("success")
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

    if (vehicleLogs.length > 0) {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 6);
      const exitTime = currentTime;
      const vehicleLog = await Vehicle.updateVehicleLog({
        id: vehicleLogs[0].id,
        exitTime
      });
      req.flash("success", "Vehicle Exit Entry Added Successfully");
      return res.redirect("/admin/dashboard");
    }

    console.trace("here");
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 6);
    const entryTime = currentTime;

    await Vehicle.addVehicleLog({licenseNumber, entryTime});

    req.flash("success", "Vehicle Entry Added Successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);

    if (err instanceof BannedVehicleError) {
      req.flash("error", "Banned vehicles can't enter the campus");
      res.redirect("/admin/dashboard");
    }
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

const viewVehicleLogs = async (req, res) => {
  try {
    const vehicleLogs = await Vehicle.getVehicleLogs({});
    const flashVehicleLogs = [];
    for (const {id, licenseNumber, entryTime, exitTime, comment, lateDuration} of vehicleLogs) {
      const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
      const user = await User.findUserByEmail(vehicle.userMail);

      const timeOfEntry = entryTime.toISOString().split("T")[1].split(".")[0]
        + " " + entryTime.toISOString().split("T")[0];
      const timeOfExit = exitTime ? exitTime.toISOString().split("T")[1].split(".")[0]
        + " " + exitTime.toISOString().split("T")[0] : "Not Exited";

      flashVehicleLogs.push({
        id,
        licenseNumber,
        entryTime: timeOfEntry,
        exitTime: timeOfExit,
        comment,
        userId: user.id,
        phoneNumber: user.phoneNumber,
        lateDuration
      });
    }

    req.flash("vehicleLogs", flashVehicleLogs);
    res.render("./admin/admin.view-logs.ejs", {
      vehicleLogs: req.flash("vehicleLogs")
    });
  } catch (err) {
    console.error(err);
  }

};

const viewVehicleDetails = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (!vehicle) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const user = await User.findUserByEmail(vehicle.userMail);
    const vehicleLogs = await Vehicle.getVehicleLogs({licenseNumber});

    const flashVehicleLogs = [];
    for (const {entryTime, exitTime, comment, lateDuration} of vehicleLogs) {
      const timeOfEntry = entryTime.toISOString().split("T")[1].split(".")[0]
        + " " + entryTime.toISOString().split("T")[0];
      const timeOfExit = exitTime ? exitTime.toISOString().split("T")[1].split(".")[0]
        + " " + exitTime.toISOString().split("T")[0] : "Not Exited";

      flashVehicleLogs.push({
        entryTime: timeOfEntry,
        exitTime: timeOfExit,
        comment,
        lateDuration
      });
    }

    req.flash("vehicleLogs", flashVehicleLogs);
    req.flash("vehicle", vehicle);
    req.flash("user", user);
    res.render("./admin/carDetails.ejs", {
      vehicleLogs: req.flash("vehicleLogs"),
      vehicle: req.flash("vehicle")[0],
      user: req.flash("user")[0],
      error: req.flash("error"),
      success: req.flash("success")
    });

  } catch (err) {
    console.error(err);
  }

};

const viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findUserById(userId);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/dashboard");
    }
    const vehicles = await Vehicle.getVehicleList({userMail: user.email});
    const flashVehicles = [];
    for (const {licenseNumber, vehicleName, approvalStatus} of vehicles) {
      flashVehicles.push({
        licenseNumber,
        vehicleName,
        approvalStatus
      });
    }
    req.flash("vehicles", flashVehicles);
    req.flash("user", user);
    res.render("./admin/userDetails.ejs", {
      vehicles: req.flash("vehicles"),
      user: req.flash("user")[0],
      error: req.flash("error"),
    });

  }catch (err) {
    console.error(err);
  }
};
const changeDuration = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    const allowedDuration = req.body.allowedDuration;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    if(allowedDuration < 0){
      req.flash("error", "Duration can't be negative");
      return res.redirect(`/admin/view-vehicle-details/${licenseNumber}`);
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber,
      defaultDuration: allowedDuration
    });
    if (vehicleUpdated) {
      req.flash("success", "Vehicle Duration Changed Successfully");
      res.redirect(`/admin/view-vehicle-details/${licenseNumber}`);
    }
  } catch (err) {
    console.error(err);
  }
};

const banVehicle = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber,
      defaultDuration: 0
    });
    if (vehicleUpdated) {
      req.flash("vehicle", vehicleUpdated);
      req.flash("success", "Vehicle Banned Successfully");
      res.redirect(`/admin/view-vehicle-details/${licenseNumber}`);
    }
  } catch (err) {
    console.error(err);
  }
};
const unbanVehicle = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber,
      defaultDuration: 20
    });
    if (vehicleUpdated) {
      req.flash("success", "Vehicle Unbanned Successfully");
      res.redirect(`/admin/view-vehicle-details/${licenseNumber}`);
    }
  } catch (err) {
    console.error(err);
  }
};


const getApproval = async (req, res) => {
  const vehicles = await Vehicle.getVehicleList({
      approvalStatus: false,
      defaultDurationFrom: 1,
      deletedAt: null
  });
  console.log(vehicles);
  req.flash("vehicles", vehicles);

  res.render("./admin/admin.approval.ejs", {
    vehicles: req.flash("vehicles"),
    error: req.flash("error"),
  });
}

// const approve = async (req, res) => {
//   const licenseNumber = req.params.licenseNumber;
//   console.log(licenseNumber);
//   const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
//   if (vehicle === null) {
//     return res.redirect("/admin/dashboard");
//   }
//   const vehicleUpdated = await Vehicle.updateVehicle({
//     licenseNumber: licenseNumber,
//     approvalStatus: true
//   });
//   if (vehicleUpdated) {
//     res.redirect("/admin/get-approval");
//   }
// }

// const reject = async (req, res) => {
//   const licenseNumber = req.params.licenseNumber;
//   const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
//   if (vehicle === null) {
//     return res.redirect("/admin/dashboard");
//   }
//   const vehicleUpdated = await Vehicle.updateVehicle({
//     licenseNumber: licenseNumber,
//     defaultDuration: 0,
//   });
//   if (vehicleUpdated) {
//     res.redirect("/admin/get-approval");
//   }
// }

const approve = async (req, res) => {
  const licenseNumber = req.body.licenseNumber;
  console.log(licenseNumber);
  const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
  if (vehicle === null) {
    return res.redirect("/admin/dashboard");
  }
  const vehicleUpdated = await Vehicle.updateVehicle({
    licenseNumber: licenseNumber,
    approvalStatus: true
  });
  if (vehicleUpdated) {
    res.redirect("/admin/get-approval");
  }
}

const reject = async (req, res) => {
  const licenseNumber = req.body.licenseNumber;
  const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
  if (vehicle === null) {
    return res.redirect("/admin/dashboard");
  }
  const vehicleUpdated = await Vehicle.updateVehicle({
    licenseNumber: licenseNumber,
    defaultDuration: 0,
  });
  if (vehicleUpdated) {
    res.redirect("/admin/get-approval");
  }
}

export {
  banVehicle,
  unbanVehicle,
  changeDuration,
  viewUserDetails,
  viewVehicleDetails,
  viewVehicleLogs,
  getAdminDashboard,
  postVehicleLogs,
  addComment,
  getApproval,
  approve,
  reject
};
