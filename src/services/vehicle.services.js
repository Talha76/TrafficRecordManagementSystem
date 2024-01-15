import Vehicle from "../models/vehicle.model.js";
import VehicleLog from "../models/vehicle-log.model.js";
import VehicleAllegation from "../models/vehicle-allegation.model.js";
import {Op} from "sequelize";
import dotenv from "dotenv";
import {
  BannedVehicleError,
  CustomError,
  MaxVehicleError,
  NotProvidedError,
  NullValueError,
  VehicleAllegationNotFoundError,
  VehicleAlreadyDeletedError,
  VehicleAlreadyExistsError,
  VehicleLogNotFoundError,
  VehicleNotFoundError,
} from "../utils/errors.js";

dotenv.config();

export async function findVehicleByLicenseNumber(licenseNumber) {
  if (typeof licenseNumber === "undefined") throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await Vehicle.findOne({
    where: {licenseNumber}
  });
  if (vehicle !== null) {
    if (vehicle.defaultDuration === 0) {
      vehicle.status = "Banned";
    } else if (vehicle.approvalStatus === true) {
      vehicle.status = "Eligible";
    } else {
      vehicle.status = "Pending";
    }
    return vehicle;
  }
  return null;
}

/**
 * Add a vehicle to the database
 * @param opts - {licenseNumber, vehicleName, userMail, defaultDuration(optional), approvalStatus(optional)}
 * @returns {Promise<any>}
 * @throws {MaxVehicleError, VehicleAlreadyExistsError, BannedVehicleError}
 */
export async function addVehicle(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.licenseNumber === "undefined") throw new NotProvidedError("licenseNumber");
  if (typeof opts.vehicleName === "undefined") throw new NotProvidedError("vehicleName");
  if (typeof opts.userMail === "undefined") throw new NotProvidedError("userMail");
  if (typeof opts.licenseNumber === null) throw new NullValueError("licenseNumber");
  if (typeof opts.vehicleName === null) throw new NullValueError("vehicleName");
  if (typeof opts.userMail === null) throw new NullValueError("userMail");

  const vehicleCount = await Vehicle.count({
    where: {
      userMail: opts.userMail,
      deletedAt: null
    }
  });

  if (vehicleCount >= parseInt(process.env.MAX_VEHICLE)) {
    throw new MaxVehicleError();
  }

  const [vehicle, created] = await Vehicle.findOrCreate({
    where: {
      licenseNumber: opts.licenseNumber
    },
    defaults: {
      vehicleName: opts.vehicleName,
      userMail: opts.userMail,
    }
  });

  if (created === false) {
    if (vehicle.deletedAt === null) {
      throw new VehicleAlreadyExistsError();
    }
    if (vehicle.defaultDuration === 0) {
      throw new BannedVehicleError();
    }
    vehicle.vehicleName = opts.vehicleName;
    vehicle.userMail = opts.userMail;
  }


  if (typeof opts.defaultDuration !== "undefined" && opts.defaultDuration !== null) {
    vehicle.defaultDuration = opts.defaultDuration;
  } else {
    vehicle.defaultDuration = 20;
  }
  if (typeof opts.approvalStatus !== "undefined" && opts.approvalStatus !== null) {
    vehicle.approvalStatus = opts.approvalStatus;
  } else {
    vehicle.approvalStatus = false;
  }

  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus === true) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
}

/**
 * Remove a vehicle from the database
 * @param licenseNumber
 * @returns {Promise<*|null>}
 * @throws {VehicleAlreadyDeletedError, BannedVehicleError, customError}
 */
export async function removeVehicle(licenseNumber) {
  if (typeof licenseNumber === "undefined") throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);

  if (vehicle === null) {
    return null;
  }

  if (vehicle.defaultDuration === 0) {
    throw new BannedVehicleError();
  }
  if (vehicle.deletedAt !== null) {
    throw new VehicleAlreadyDeletedError();
  }

  const log = await VehicleLog.findOne({
    where: {
      licenseNumber: vehicle.licenseNumber,
      exitTime: null
    }
  });
  if (log !== null) {
    throw new CustomError("Vehicle is in the parking lot. Cannot be removed.");
  }

  vehicle.deletedAt = new Date();
  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus === true) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
}

/**
 * Updates Vehicle
 * @param opts - {licenseNumber, defaultDuration, approvalStatus, vehicleName, userMail}
 * @returns {Promise<any>}
 * @throws {VehicleNotFoundError, BannedVehicleError}
 */
export async function updateVehicle(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.licenseNumber === "undefined") throw new NotProvidedError("licenseNumber");
  if (opts.licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await findVehicleByLicenseNumber(opts.licenseNumber);
  if (vehicle === null) {
    throw new VehicleNotFoundError();
  }

  if (typeof opts.defaultDuration !== "undefined" && opts.defaultDuration !== null) {
    vehicle.defaultDuration = opts.defaultDuration;
  }
  if (typeof opts.approvalStatus !== "undefined" && opts.approvalStatus !== null) {
    vehicle.approvalStatus = opts.approvalStatus;
  }
  if (typeof opts.vehicleName !== "undefined" && opts.vehicleName !== null) {
    vehicle.vehicleName = opts.vehicleName;
  }
  if (typeof opts.userMail !== "undefined" && opts.userMail !== null) {
    vehicle.userMail = opts.userMail;
  }

  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus === true) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
}

/**
 * Get list of vehicles
 * @param opts - {userMail, defaultDurationEqual, defaultDurationTo, defaultDurationFrom, approvalStatus, deletedAt}(all optional)
 * @returns {Promise<Model<any, TModelAttributes>[]>}
 */
export async function getVehicleList(opts) {
  if (typeof opts === "undefined") opts = {};
  const queries = {};
  if (typeof opts.deletedAt !== "undefined") {
    queries.deletedAt = opts.deletedAt;
  }
  if (typeof opts.userMail !== "undefined" && opts.userMail !== null) {
    queries.userMail = opts.userMail;
  }
  if (typeof opts.defaultDurationEqual !== "undefined" && opts.defaultDurationEqual !== null) {
    queries.defaultDuration = opts.defaultDurationEqual;
  } else if (typeof opts.defaultDurationTo !== "undefined" && opts.defaultDurationTo !== null && typeof opts.defaultDurationFrom !== "undefined" && opts.defaultDurationFrom !== null) {
    queries.defaultDuration = {
      [Op.between]: [opts.defaultDurationFrom, opts.defaultDurationTo]
    };
  } else if (typeof opts.defaultDurationTo !== "undefined" && opts.defaultDurationTo !== null) {
    queries.defaultDuration = {
      [Op.lte]: opts.defaultDurationTo
    };
  } else if (typeof opts.defaultDurationFrom !== "undefined" && opts.defaultDurationFrom !== null) {
    queries.defaultDuration = {
      [Op.gte]: opts.defaultDurationFrom
    };
  }
  if (typeof opts.approvalStatus !== "undefined" && opts.approvalStatus !== null) {
    queries.approvalStatus = opts.approvalStatus;
  }

  const vehicles = await Vehicle.findAll({where: queries});
  vehicles.forEach(vehicle => {
    if (vehicle.defaultDuration === 0) {
      vehicle.status = "Banned";
      return;
    }
    if (vehicle.approvalStatus === true) {
      vehicle.status = "Eligible";
    } else {
      vehicle.status = "Pending";
    }
  });

  return vehicles;
}

export async function findVehicleLogById(id) {
  if (typeof id === "undefined") throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

  const log = await VehicleLog.findByPk(id);
  if (log === null) {
    return null;
  }

  const exitTime = log.exitTime === null ? new Date() : log.exitTime;
  log.lateDuration = Math.max(0, (exitTime - log.entryTime) / 1000 / 60 - log.allowedDuration);

  return log;
}

/**
 * Add a vehicle log to the database
 * @param opts - {licenseNumber, entryTime, allowedDuration(optional), comment(optional)}
 * @returns {Promise<awaited Model<any, TModelAttributes>>}
 * @throws {VehicleNotFoundError, BannedVehicleError}
 */
export async function addVehicleLog(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.licenseNumber === "undefined") throw new NotProvidedError("licenseNumber");
  if (typeof opts.entryTime === "undefined") throw new NotProvidedError("entryTime");
  if (opts.licenseNumber === null) throw new NullValueError("licenseNumber");
  if (opts.entryTime === null) throw new NullValueError("entryTime");

  const vehicle = await findVehicleByLicenseNumber(opts.licenseNumber);
  if (vehicle === null) {
    throw new VehicleNotFoundError();
  }

  if (vehicle.defaultDuration === 0) {
    throw new BannedVehicleError();
  }

  const log = await VehicleLog.build({
    licenseNumber: opts.licenseNumber,
    entryTime: opts.entryTime,
  });
  if (typeof opts.allowedDuration !== "undefined" && opts.allowedDuration !== null) {
    log.allowedDuration = opts.allowedDuration;
  }
  if (typeof opts.comment !== "undefined") {
    log.comment = opts.comment;
  }
  return await log.save();
}

/**
 * Updates a vehicle log
 * @param opts - {id, entryTime, exitTime(optional), allowedDuration(optional), comment(optional)}
 * @returns {Promise<Model<any, TModelAttributes>>}
 * @throws {VehicleLogNotFoundError}
 */
export async function updateVehicleLog(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.id === "undefined") throw new NotProvidedError("id");
  if (opts.id === null) throw new NullValueError("id");

  const log = await findVehicleLogById(opts.id);
  if (log === null) {
    throw new VehicleLogNotFoundError();
  }

  if (typeof opts.entryTime !== "undefined" && opts.entryTime !== null) {
    log.entryTime = opts.entryTime;
  }
  if (typeof opts.exitTime !== "undefined") {
    log.exitTime = opts.exitTime;
  }
  if (typeof opts.allowedDuration !== "undefined" && opts.allowedDuration !== null) {
    log.allowedDuration = opts.allowedDuration;
  }
  if (typeof opts.comment !== "undefined") {
    log.comment = opts.comment;
  }
  return await log.save();
}

/**
 * Get list of vehicle logs
 * @param opts - {licenseNumber, entryTimeEqual, entryTimeTo, entryTimeFrom, exitTimeEqual, exitTimeTo, exitTimeFrom, allowedDurationEqual, allowedDurationTo, allowedDurationFrom}(all optional)
 * @returns {Promise<Model<any, TModelAttributes>[]>}
 */
export async function getVehicleLogs(opts) {
  if (typeof opts === "undefined") opts = {};
  const queries = {};
  if (typeof opts.licenseNumber !== "undefined" && opts.licenseNumber !== null) {
    queries.licenseNumber = opts.licenseNumber;
  }
  if (typeof opts.entryTimeEqual !== "undefined" && opts.entryTimeEqual !== null) {
    queries.entryTime = entryTimeEqual;
  } else if (typeof opts.entryTimeTo !== "undefined" && opts.entryTimeTo !== null && typeof opts.entryTimeFrom !== "undefined" && opts.entryTimeFrom !== null) {
    queries.entryTime = {
      [Op.between]: [opts.entryTimeFrom, opts.entryTimeTo]
    };
  } else if (typeof opts.entryTimeTo !== "undefined" && opts.entryTimeTo !== null) {
    queries.entryTime = {
      [Op.lte]: opts.entryTimeTo
    };
  } else if (typeof opts.entryTimeFrom !== "undefined" && opts.entryTimeFrom !== null) {
    queries.entryTime = {
      [Op.gte]: opts.entryTimeFrom
    };
  }
  if (typeof opts.exitTimeEqual !== "undefined") {
    queries.exitTime = opts.exitTimeEqual;
  } else if (typeof opts.exitTimeTo !== "undefined" && opts.exitTimeTo !== null && typeof opts.exitTimeFrom !== "undefined" && opts.exitTimeFrom !== null) {
    queries.exitTime = {
      [Op.between]: [opts.exitTimeFrom, opts.exitTimeTo]
    };
  } else if (typeof opts.exitTimeTo !== "undefined" && opts.exitTimeTo !== null) {
    queries.exitTime = {
      [Op.lte]: opts.exitTimeTo
    };
  } else if (typeof opts.exitTimeFrom !== "undefined" && opts.exitTimeFrom !== null) {
    queries.exitTime = {
      [Op.gte]: opts.exitTimeFrom
    };
  }
  if (typeof opts.allowedDurationEqual !== "undefined" && opts.allowedDurationEqual !== null) {
    queries.allowedDuration = opts.allowedDurationEqual;
  } else if (typeof opts.allowedDurationTo !== "undefined" && opts.allowedDurationTo !== null && typeof opts.allowedDurationFrom !== "undefined" && opts.allowedDurationFrom !== null) {
    queries.allowedDuration = {
      [Op.between]: [opts.allowedDurationFrom, opts.allowedDurationTo]
    };
  } else if (typeof opts.allowedDurationTo !== "undefined" && opts.allowedDurationTo !== null) {
    queries.allowedDuration = {
      [Op.lte]: opts.allowedDurationTo
    };
  } else if (typeof opts.allowedDurationFrom !== "undefined" && opts.allowedDurationFrom !== null) {
    queries.allowedDuration = {
      [Op.gte]: opts.allowedDurationFrom
    };
  }

  const results = await VehicleLog.findAll({where: queries});
  for (const row of results) {
    if (row.exitTime) {
      row.lateDuration = Math.max(0, (row.exitTime - row.entryTime) / 1000 / 60 - row.allowedDuration);
    } else {
      row.lateDuration = Math.max(0, (new Date() - row.entryTime) / 1000 / 60 - row.allowedDuration);
    }
  }
  return results;
}

export async function findVehicleAllegationById(id) {
  if (typeof id === "undefined") throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

  return await VehicleAllegation.findByPk(id);
}

/**
 * Add a vehicle allegation to the database
 * @param opts - {logId, lateDuration, comment(optional)}
 * @returns {Promise<awaited Model<any, TModelAttributes> | Promise<{hasteFS: IHasteFS, moduleMap: IModuleMap}>>}
 * @throws {VehicleLogNotFoundError}
 */
export async function addVehicleAllegation(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.lateDuration === "undefined") throw new NotProvidedError("lateDuration");
  if (opts.lateDuration === null) throw new NullValueError("lateDuration");
  if (typeof opts.logId === "undefined") throw new NotProvidedError("logId");
  if (opts.logId === null) throw new NullValueError("logId");

  const log = await findVehicleLogById(opts.logId);
  if (log === null) {
    throw new VehicleLogNotFoundError();
  }

  const allegation = await VehicleAllegation.build({
    logId: opts.logId,
    lateDuration: opts.lateDuration,
  });
  if (typeof opts.comment !== "undefined") {
    allegation.comment = opts.comment;
  }
  return await allegation.save();
}

/**
 * Updates a vehicle allegation
 * @param opts - {id, comment}
 * @returns {Promise<Model<any, TModelAttributes>>}
 * @throws {VehicleAllegationNotFoundError}
 */
export async function updateVehicleAllegation(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.id === "undefined") throw new NotProvidedError("id");
  if (opts.id === null) throw new NotProvidedError("id");

  const allegation = await findVehicleAllegationById(opts.id);
  if (allegation === null) {
    throw new VehicleAllegationNotFoundError();
  }

  if (typeof opts.comment !== "undefined") {
    allegation.comment = opts.comment;
  }
  return await allegation.save();
}

/**
 * Get list of vehicle allegations
 * @param opts - {licenseNumber, lateDurationEqual, lateDurationTo, lateDurationFrom}(all optional)
 * @returns {Promise<any>}
 */
export async function getVehicleAllegations(opts) {
  if (typeof opts === "undefined") opts = {};
  let logs = await getVehicleLogs({licenseNumber: opts.licenseNumber});
  const queries = {
    logId: {
      [Op.in]: logs.map(log => log.id)
    }
  };
  if (typeof opts.lateDurationEqual !== "undefined" && opts.lateDurationEqual !== null) {
    queries.lateDuration = opts.lateDurationEqual;
  } else if (typeof opts.lateDurationTo !== "undefined" && opts.lateDurationTo !== null && typeof opts.lateDurationFrom !== "undefined" && opts.lateDurationFrom !== null) {
    queries.lateDuration = {
      [Op.between]: [opts.lateDurationFrom, opts.lateDurationTo]
    };
  } else if (typeof opts.lateDurationTo !== "undefined" && opts.lateDurationTo !== null) {
    queries.lateDuration = {
      [Op.lte]: opts.lateDurationTo
    };
  } else if (typeof opts.lateDurationFrom !== "undefined" && opts.lateDurationFrom !== null) {
    queries.lateDuration = {
      [Op.gte]: opts.lateDurationFrom
    };
  }

  return await VehicleAllegation.findAll({where: queries});
}
