import Vehicle from "../models/Vehicle.model.js";
import VehicleLog from "../models/VehicleLog.model.js";
import VehicleAllegation from "../models/VehicleAllegation.model.js";
import {Op} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export async function findVehicleByLicenseNumber(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle lookup');
  }

  const vehicle = await Vehicle.findByPk(licenseNumber);
  if (vehicle) {
    return vehicle;
  }
  return null;
}

export async function addVehicle({
                                   licenseNumber = undefined,
                                   defaultDuration = undefined,
                                   approvalStatus = undefined,
                                   vehicleName = undefined,
                                   userMail = undefined,
                                 }) {
  if (licenseNumber === undefined || vehicleName === undefined || userMail === undefined ||
    !licenseNumber || !vehicleName || !userMail) {
    throw new Error('Error: License number, vehicle name and user email must be provided for vehicle creation');
  }

  let vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (vehicle) {
    if (vehicle.defaultDuration === 0) {
      throw new Error('Error: Vehicle is banned');
    }
    if (vehicle.deletedAt === null) {
      throw new Error('Error: Vehicle already exists');
    }
  }

  const vehicleCount = await Vehicle.count({
    where: {
      userMail: userMail,
      deletedAt: null
    }
  });

  console.trace(vehicleCount.toString(), process.env.MAX_VEHICLE);
  if (vehicleCount.toString() === process.env.MAX_VEHICLE) {
    throw new Error('Error: Maximum number of vehicles reached');
  }

  let created;
  [vehicle, created] = await Vehicle.findOrCreate({
    where: {
      licenseNumber: licenseNumber
    },
    defaults: {
      vehicleName: vehicleName,
      userMail: userMail,
      deletedAt: null
    }
  });
  if (created === false) {
    vehicle.vehicleName = vehicleName;
    vehicle.userMail = userMail;
    vehicle.deletedAt = null;
  }
  if (defaultDuration !== undefined) {
    vehicle.defaultDuration = defaultDuration;
  }
  if (approvalStatus !== undefined) {
    vehicle.approvalStatus = approvalStatus;
  }
  return await vehicle.save();
}

export async function removeVehicle(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle deletion');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (vehicle) {
    if (vehicle.defaultDuration === 0) {
      throw new Error('Error: Banned vehicles cannot be deleted');
    }
    if (vehicle.deletedAt !== null) {
      throw new Error('Error: Vehicle already deleted');
    }

    vehicle.deletedAt = new Date();
    return await vehicle.save();
  }
  return null;
}

export async function updateVehicle({
                                      licenseNumber = undefined,
                                      defaultDuration = undefined,
                                      approvalStatus = undefined,
                                      vehicleName = undefined
                                    }) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle lookup');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new Error('Error: Vehicle not found');
  }

  if (defaultDuration !== undefined) {
    vehicle.defaultDuration = defaultDuration;
  }
  if (approvalStatus !== undefined) {
    vehicle.approvalStatus = approvalStatus;
  }
  if (vehicleName !== undefined) {
    vehicle.vehicleName = vehicleName;
  }
  return await vehicle.save();
}

export async function getVehicleList({
                                       userMail = undefined,
                                       defaultDurationEqual = undefined,
                                       defaultDurationTo = undefined,
                                       defaultDurationFrom = undefined,
                                       approvalStatus = undefined,
                                     }) {
  const queries = {
    deletedAt: null
  };
  if (userMail !== undefined && userMail) {
    queries.userMail = userMail;
  }
  if (defaultDurationEqual !== undefined && defaultDurationEqual) {
    queries.defaultDuration = defaultDurationEqual;
  } else if (defaultDurationTo !== undefined && defaultDurationTo && defaultDurationFrom !== undefined && defaultDurationFrom) {
    queries.defaultDuration = {
      [Op.between]: [defaultDurationFrom, defaultDurationTo]
    }
  } else if (defaultDurationTo !== undefined && defaultDurationTo) {
    queries.defaultDuration = {
      [Op.lte]: defaultDurationTo
    }
  } else if (defaultDurationFrom !== undefined && defaultDurationFrom) {
    queries.defaultDuration = {
      [Op.gte]: defaultDurationFrom
    }
  }
  if (approvalStatus !== undefined && approvalStatus) {
    queries.approvalStatus = approvalStatus;
  }

  return await Vehicle.findAll({where: queries});
}

export async function findVehicleLogById(id) {
  if (id === undefined || !id) {
    throw new Error('Error: ID must be provided for vehicle log lookup');
  }

  const log = await VehicleLog.findByPk(id);
  if (log) {
    return log;
  }
  return null;
}

export async function addVehicleLog({
                                      licenseNumber = undefined,
                                      entryTime = undefined,
                                      allowedDuration = undefined,
                                      comment = undefined
                                    }) {
  if (licenseNumber === undefined || entryTime === undefined ||
    !licenseNumber || !entryTime) {
    throw new Error('Error: License number, entry time, and allowed duration must be provided for vehicle log creation');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new Error('Error: Vehicle not found');
  }

  if (vehicle.defaultDuration === 0) {
    throw new Error('Error: Banned vehicles cannot be logged');
  }

  const log = await VehicleLog.build({
    licenseNumber: licenseNumber,
    entryTime: entryTime,
  });
  if (allowedDuration !== undefined && allowedDuration) {
    log.allowedDuration = allowedDuration;
  }
  if (comment !== undefined && comment) {
    log.comment = comment;
  }
  return await log.save();
}

export async function updateVehicleLog({
                                         id = undefined,
                                         entryTime = undefined,
                                         exitTime = undefined,
                                         allowedDuration = undefined,
                                         comment = undefined
                                       }) {
  if (id === undefined || !id) {
    throw new Error('Error: ID must be provided for vehicle log lookup');
  }

  const log = await findVehicleLogById(id);
  if (!log) {
    throw new Error('Error: Vehicle log not found');
  }

  if (entryTime !== undefined && entryTime) {
    log.entryTime = entryTime;
  }
  if (exitTime !== undefined) {
    log.exitTime = exitTime;
  }
  if (allowedDuration !== undefined && allowedDuration) {
    log.allowedDuration = allowedDuration;
  }
  if (comment !== undefined) {
    log.comment = comment;
  }
  return await log.save();
}

export async function getVehicleLogs({
                                       licenseNumber = undefined,
                                       entryTimeEqual = undefined,
                                       entryTimeTo = undefined,
                                       entryTimeFrom = undefined,
                                       exitTimeEqual = undefined,
                                       exitTimeTo = undefined,
                                       exitTimeFrom = undefined,
                                       allowedDurationEqual = undefined,
                                       allowedDurationTo = undefined,
                                       allowedDurationFrom = undefined
                                     }) {
  const queries = {};
  if (licenseNumber !== undefined && licenseNumber) {
    queries.licenseNumber = licenseNumber;
  }
  if (entryTimeEqual !== undefined && entryTimeEqual) {
    queries.entryTime = entryTimeEqual;
  } else if (entryTimeTo !== undefined && entryTimeTo && entryTimeFrom !== undefined && entryTimeFrom) {
    queries.entryTime = {
      [Op.between]: [entryTimeFrom, entryTimeTo]
    }
  } else if (entryTimeTo !== undefined && entryTimeTo) {
    queries.entryTime = {
      [Op.lte]: entryTimeTo
    }
  } else if (entryTimeFrom !== undefined && entryTimeFrom) {
    queries.entryTime = {
      [Op.gte]: entryTimeFrom
    }
  }
  if (exitTimeEqual !== undefined) {
    queries.exitTime = exitTimeEqual;
  } else if (exitTimeTo !== undefined && exitTimeFrom !== undefined) {
    queries.exitTime = {
      [Op.between]: [exitTimeFrom, exitTimeTo]
    }
  } else if (exitTimeTo !== undefined) {
    queries.exitTime = {
      [Op.lte]: exitTimeTo
    }
  } else if (exitTimeFrom !== undefined) {
    queries.exitTime = {
      [Op.gte]: exitTimeFrom
    }
  }
  if (allowedDurationEqual !== undefined && allowedDurationEqual) {
    queries.allowedDuration = allowedDurationEqual;
  } else if (allowedDurationTo !== undefined && allowedDurationTo && allowedDurationFrom !== undefined && allowedDurationFrom) {
    queries.allowedDuration = {
      [Op.between]: [allowedDurationFrom, allowedDurationTo]
    }
  } else if (allowedDurationTo !== undefined && allowedDurationTo) {
    queries.allowedDuration = {
      [Op.lte]: allowedDurationTo
    }
  } else if (allowedDurationFrom !== undefined && allowedDurationFrom) {
    queries.allowedDuration = {
      [Op.gte]: allowedDurationFrom
    }
  }

  return await VehicleLog.findAll({where: queries});
}

export async function findVehicleAllegationById(id) {
  if (id === undefined || !id) {
    throw new Error('Error: ID must be provided for vehicle allegation lookup');
  }

  const allegation = await VehicleAllegation.findByPk(id);
  if (allegation) {
    return allegation;
  }
  return null;
}

export async function updateVehicleAllegation({id = undefined, comment = undefined}) {
  if (id === undefined || !id) {
    throw new Error('Error: ID must be provided for vehicle allegation lookup');
  }

  const allegation = await findVehicleAllegationById(id);
  if (!allegation) {
    throw new Error('Error: Vehicle allegation not found');
  }

  if (comment !== undefined) {
    allegation.comment = comment;
  }
  return await allegation.save();
}

export async function getVehicleAllegations({
                                              licenseNumber = undefined,
                                              lateDurationEqual = undefined,
                                              lateDurationTo = undefined,
                                              lateDurationFrom = undefined
                                            }) {
  let logs = await getVehicleLogs({licenseNumber: licenseNumber});
  const queries = {
    logId: {
      [Op.in]: logs.map(log => log.dataValues.id)
    }
  };
  if (lateDurationEqual !== undefined && lateDurationEqual) {
    queries.lateDuration = lateDurationEqual;
  } else if (lateDurationTo !== undefined && lateDurationTo && lateDurationFrom !== undefined && lateDurationFrom) {
    queries.lateDuration = {
      [Op.between]: [lateDurationFrom, lateDurationTo]
    }
  } else if (lateDurationTo !== undefined && lateDurationTo) {
    queries.lateDuration = {
      [Op.lte]: lateDurationTo
    }
  } else if (lateDurationFrom !== undefined && lateDurationFrom) {
    queries.lateDuration = {
      [Op.gte]: lateDurationFrom
    }
  }

  return await VehicleAllegation.findAll({where: queries});
}
