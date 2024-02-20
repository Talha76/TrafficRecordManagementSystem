import * as Vehicle from "../../services/vehicle.services.js";
import * as User from "../../services/user.services.js";
import {findVehiclesStayingUpto} from "../../services/admin.services.js";
import {BannedVehicleError} from "../../utils/errors.js";
import {printableDateTime, queryTypes, zip} from "../../utils/utility.js";
import generateReport from "../../services/report-generation.services.js";
import {sendBanEmail} from "../../services/mail.services.js";

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

    for (const [user, vehicle, log] of zip([users, vehicles, vehiclesStayingCurrently])) {
      const {id, entryTime, licenseNumber, comment} = log;
      const timeOfEntry = printableDateTime(entryTime);
      flashVehicleLogs.push({
        id,
        licenseNumber,
        entryTime: timeOfEntry,
        comment,
        userId: user.id,
        phoneNumber: user.phoneNumber,
        extendedDuration: log.allowedDuration - vehicle.defaultDuration,
      });
    }

    if (flashVehicleLogs.length > 0) req.flash("vehicleLogs", flashVehicleLogs);
    const appUser = req.user;
    appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
    req.flash("appUser", appUser);
    res.render("./admin/admin.dashboard.ejs", {
      appUser: req.flash("appUser")[0],
      vehicleLogs: req.flash("vehicleLogs"),
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (err) {
    console.error(err);
  }
};

const postVehicleLogs = async (req, res) => {
  try {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 6);
    const licenseNumber = req.body.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const vehicleLogs = await Vehicle.getVehicleLogs({
      licenseNumber: licenseNumber,
      exitTimeEqual: null,
    });
    if (vehicleLogs.length > 0) {
      const {
        exceedMaxParkingLimit,
        exceedAllegationLimit
      } = await Vehicle.addVehicleExit(vehicleLogs[0], currentTime);

      if (exceedMaxParkingLimit) {
        req.flash("error", `Vehicle has been banned due to exceeding ${parseInt(process.env.MAX_TOLERABLE_LATEDURATION) / 60} hours`);
      }
      if (exceedAllegationLimit) {
        req.flash("error", `Vehicle has been banned due to violating parking time limit for ${process.env.MAX_TOLERABLE_ALLEGATION} times`);
      }

      req.flash("success", "Vehicle Exit Entry Added Successfully");
      return res.redirect("/admin/dashboard");
    }
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
    if (comment === "") {
      req.flash("error", "Comment can't be empty");
      return res.redirect("/admin/dashboard");
    }
    const vehicleLog = await Vehicle.findVehicleLogById(logId);
    if (vehicleLog === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const vehicleLogUpdated = await Vehicle.updateVehicleLog({
      id: vehicleLog.id,
      comment,
    });
    if (vehicleLogUpdated) {
      req.flash("success", "Comment added Successfully");
      res.redirect("/admin/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};

async function extendDuration(req, res) {
  try {
    const logId = req.body.logId;
    const extendedDuration = parseInt(req.body.extendTime);
    if (extendedDuration < 0) {
      req.flash("error", "Duration can't be negative");
      return res.redirect("/admin/dashboard");
    }

    const appUser = req.user;
    if (appUser.designation !== "sco") {
      if (extendedDuration > 20) {
        req.flash("error", "Duration can't be more than 20 minutes");
        return res.redirect("/admin/dashboard");
      }
    }
    const vehicleLog = await Vehicle.findVehicleLogById(logId);
    if (vehicleLog === null) {
      req.flash("error", "Vehicle not found");
      return res.redirect("/admin/dashboard");
    }
    const newAllowedDuration = vehicleLog.allowedDuration + extendedDuration;
    const vehicleLogUpdated = await Vehicle.updateVehicleLog({
      id: vehicleLog.id,
      allowedDuration: newAllowedDuration,
    });
    if (vehicleLogUpdated) {
      req.flash("success", `${extendedDuration} minutes extended Successfully`);
      res.redirect("/admin/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
}

const viewVehicleLogs = async (req, res) => {
  try {
    const vehicleLogs = await Vehicle.getVehicleLogs();
    const vehiclePromises = [];
    for (const {licenseNumber} of vehicleLogs) {
      vehiclePromises.push(Vehicle.findVehicleByLicenseNumber(licenseNumber));
    }
    const vehicles = await Promise.all(vehiclePromises);

    const userPromises = [];
    for (const {userMail} of vehicles) {
      userPromises.push(User.findUserByEmail(userMail));
    }
    const users = await Promise.all(userPromises);

    const flashVehicleLogs = [];
    for (const [user, log] of zip([users, vehicleLogs])) {
      const timeOfEntry = printableDateTime(log.entryTime);
      const timeOfExit = log.exitTime
        ? printableDateTime(log.exitTime)
        : "Not Exited";

      flashVehicleLogs.push({
        id: log.id,
        licenseNumber: log.licenseNumber,
        entryTime: timeOfEntry,
        exitTime: timeOfExit,
        comment: log.comment,
        userId: user.id,
        phoneNumber: user.phoneNumber,
        lateDuration: log.lateDuration,
      });
    }

    if (flashVehicleLogs.length > 0) req.flash("vehicleLogs", flashVehicleLogs);
    const appUser = req.user;
    appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
    req.flash("appUser", appUser);
    res.render("./admin/admin.view-logs.ejs", {
      appUser: req.flash("appUser")[0],
      vehicleLogs: req.flash("vehicleLogs"),
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
      const timeOfEntry = printableDateTime(entryTime);
      const timeOfExit = exitTime ? printableDateTime(exitTime) : "Not Exited";

      flashVehicleLogs.push({
        entryTime: timeOfEntry,
        exitTime: timeOfExit,
        comment,
        lateDuration,
      });
    }

    const appUser = req.user;
    appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
    req.flash("appUser", appUser);
    if (flashVehicleLogs.length > 0) {
      req.flash("vehicleLogs", flashVehicleLogs);
    }
    req.flash("vehicle", vehicle);
    req.flash("user", user);
    res.render("./admin/carDetails.ejs", {
      vehicleLogs: req.flash("vehicleLogs"),
      vehicle: req.flash("vehicle")[0],
      user: req.flash("user")[0],
      error: req.flash("error"),
      success: req.flash("success"),
      appUser: req.flash("appUser")[0],
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
    const vehicles = await Vehicle.getVehicleList({
      userMail: user.email,
      deletedAt: null,
    });
    const flashVehicles = [];
    for (const {
      licenseNumber,
      vehicleName,
      approvalStatus,
      defaultDuration,
    } of vehicles) {
      flashVehicles.push({
        licenseNumber,
        vehicleName,
        approvalStatus,
        defaultDuration,
      });
    }
    const appUser = req.user;
    appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
    req.flash("appUser", appUser);

    req.flash("vehicles", flashVehicles);
    req.flash("user", user);
    res.render("./admin/userDetails.ejs", {
      vehicles: req.flash("vehicles"),
      user: req.flash("user")[0],
      error: req.flash("error"),
      appUser: req.flash("appUser")[0],
    });
  } catch (err) {
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
    if (allowedDuration < 0) {
      req.flash("error", "Duration can't be negative");
      return res.redirect(`/admin/view-vehicle-details/${licenseNumber}`);
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber,
      defaultDuration: allowedDuration,
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
      defaultDuration: 0,
    });
    if (vehicleUpdated) {
      await sendBanEmail(vehicle.userMail, vehicle.licenseNumber);
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
      defaultDuration: 20,
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
    deletedAt: null,
  });
  const vehicleInfo = [];
  if (vehicles) {
    for (const vehicle of vehicles) {
      const user = await User.findUserByEmail(vehicle.userMail);
      vehicleInfo.push({
        licenseNumber: vehicle.licenseNumber,
        vehicleName: vehicle.vehicleName,
        approvalStatus: vehicle.approvalStatus,
        defaultDuration: vehicle.defaultDuration,
        userId: user.id,
        userName: user.name,
      });
    }
  }

  const appUser = req.user;
  appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
  req.flash("appUser", appUser);
  if (vehicleInfo.length > 0) req.flash("vehicleInfo", vehicleInfo);

  res.render("./admin/admin.approval.ejs", {
    vehicleInfo: req.flash("vehicleInfo"),
    error: req.flash("error"),
    success: req.flash("success"),
    appUser: appUser ? req.flash("appUser")[0] : null,
  });
};


const approve = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    console.trace(licenseNumber);
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      return res.redirect("/admin/dashboard");
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber: licenseNumber,
      approvalStatus: true,
    });
    if (vehicleUpdated) {
      req.flash("success", "Vehicle Approved Successfully");
      res.redirect("/admin/get-approval");
    }
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    return res.redirect("/admin/get-approval");
  }
};

const reject = async (req, res) => {
  try {
    const licenseNumber = req.params.licenseNumber;
    const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumber);
    if (vehicle === null) {
      return res.redirect("/admin/dashboard");
    }
    const vehicleUpdated = await Vehicle.updateVehicle({
      licenseNumber: licenseNumber,
      defaultDuration: 0,
    });
    if (vehicleUpdated) {
      req.flash("success", "Vehicle Rejected Successfully");
      res.redirect("/admin/get-approval");
    }
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    return res.redirect("/admin/get-approval");
  }
};

async function getGenerateReport(req, res) {
  try {
    const appUser = req.user;
    appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
    req.flash("appUser", appUser);
    res.render("./admin/reportGeneration.ejs", {
      error: req.flash("error"),
      success: req.flash("success"),
      appUser: req.flash("appUser")[0],
    });
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    return res.redirect("/admin/dashboard");
  }
}

async function postGenerateReport(req, res) {
  const {licenseNumber, userId, carType, from, to} = req.body;
  console.trace(req.body);
  try {
    const options = {};
    if (licenseNumber !== undefined && licenseNumber.length > 0) {
      options.licenseNumber = licenseNumber;
    }
    if (userId !== undefined && userId.length > 0) {
      options.userId = parseInt(userId);
    }
    if (carType !== undefined) {
      if (carType === "currentCars") {
        options.queryType = queryTypes.CURRENTLY_IN_IUT;
      } else if (carType === "lateExit") {
        options.queryType = queryTypes.LATE_ONLY;
      } else if (carType === "bannedCars") {
        options.queryType = queryTypes.BANNED_ONLY;
      }
    }
    if (from.length > 0) {
      options.from = new Date(from);
    }
    if (to.length > 0) {
      options.to = new Date(to);
    }

    await generateReport(options);

    res.download("./output.pdf");
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    res.redirect("/admin/generate-report");
  }
}


async function getUserVehicleList(req, res) {
  const vehicles = await Vehicle.getVehicleList({
    deletedAt: null,
  });

  const flashVehicles = [];
  for (const {
    licenseNumber,
    userMail,
    defaultDuration
  } of vehicles) {
    const user = await User.findUserByEmail(userMail);
    flashVehicles.push({
      licenseNumber,
      userId: user.id,
      banStatus: defaultDuration === 0 ? "Banned" : "Eligible",
    });
  }

  const appUser = req.user;
  appUser.designation = appUser.designation === "sco" ? "SCO" : "PT";
  req.flash("appUser", appUser);

  req.flash("vehicles", flashVehicles);
  res.render("./admin/user-vehicle-list.ejs", {
    vehicles: req.flash("vehicles"),
    error: req.flash("error"),
    success: req.flash("success"),
    appUser: req.flash("appUser")[0],
  });
}


const postApproval = async (req, res) => {
  const action = req.body.action;

  let licenseNumbers = [];
  licenseNumbers = req.body.formCheck;

  if (!Array.isArray(licenseNumbers)) {
    licenseNumbers = [licenseNumbers];
  }

  try {
    if (action === "approve") {
      for (let i = 0; i < licenseNumbers.length; i++) {
        const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumbers[i]);
        if (vehicle === null) {
          return res.redirect("/admin/get-approval");
        }
        await Vehicle.updateVehicle({
          licenseNumber: licenseNumbers[i],
          approvalStatus: true,
        });
      }
    } else {
      for (let i = 0; i < licenseNumbers.length; i++) {
        const vehicle = await Vehicle.findVehicleByLicenseNumber(licenseNumbers[i]);
        if (vehicle === null) {
          return res.redirect("/admin/get-approval");
        }
        await Vehicle.updateVehicle({
          licenseNumber: licenseNumbers[i],
          approvalStatus: true,
          defaultDuration: 0,
        });
      }
    }
  } catch (err) {
    console.error(err);

    req.flash("error", err.message);
    return res.redirect("/admin/get-approval");
  }

  res.redirect("/admin/get-approval");
};

export {
  getUserVehicleList,
  postGenerateReport,
  getGenerateReport,
  extendDuration,
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
  postApproval,
  approve,
  reject,
};
