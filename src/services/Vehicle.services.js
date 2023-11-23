import Vehicle from "../models/Vehicle.model.js";
import VehicleLog from "../models/VehicleLog.model.js";
import VehicleAllegation from "../models/VehicleAllegation.model.js";
import {Op} from "sequelize";
import dotenv from "dotenv";
import {
  BannedVehicleError,
  MaxVehicleError,
  NotProvidedError,
  NullValueError, VehicleAllegationNotFoundError, VehicleAlreadyDeletedError,
  VehicleAlreadyExistsError, VehicleLogNotFoundError, VehicleNotFoundError
} from "../utils/errors.js";

dotenv.config();

export async function findVehicleByLicenseNumber(licenseNumber) {
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await Vehicle.findOne({
    where: {
      licenseNumber: licenseNumber,
      deletedAt: null
    }
  });
  if (vehicle) {
    if (vehicle.defaultDuration === 0) {
      vehicle.status = "Banned";
    } else if (vehicle.approvalStatus) {
      vehicle.status = "Eligible";
    } else {
      vehicle.status = "Pending";
    }
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
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (vehicleName === undefined) throw new NotProvidedError("vehicleName");
  if (userMail === undefined) throw new NotProvidedError("userMail");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");
  if (vehicleName === null) throw new NullValueError("vehicleName");
  if (userMail === null) throw new NullValueError("userMail");

  const vehicleCount = await Vehicle.count({
    where: {
      userMail: userMail,
      deletedAt: null
    }
  });

  if (vehicleCount >= parseInt(process.env.MAX_VEHICLE)) {
    throw new MaxVehicleError();
  }

  const [vehicle, created] = await Vehicle.findOrCreate({
    where: {
      licenseNumber: licenseNumber
    },
    defaults: {
      vehicleName: vehicleName,
      userMail: userMail,
    }
  });

  if (!created) {
    if (vehicle.defaultDuration === 0) {
      throw new BannedVehicleError();
    }
    if (vehicle.deletedAt === null) {
      throw new VehicleAlreadyExistsError();
    }
  }

  if (!created) {
    vehicle.vehicleName = vehicleName;
    vehicle.userMail = userMail;
    vehicle.deletedAt = null;
    if (approvalStatus === undefined) {
      vehicle.approvalStatus = false;
    }
  }
  if (defaultDuration !== undefined) {
    vehicle.defaultDuration = defaultDuration;
  }
  if (approvalStatus !== undefined) {
    vehicle.approvalStatus = approvalStatus;
  }

  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
}

export async function removeVehicle(licenseNumber) {
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);

  if (!vehicle) {
    return null;
  }

  if (vehicle.defaultDuration === 0) {
    throw new BannedVehicleError();
  }
  if (vehicle.deletedAt !== null) {
    throw new VehicleAlreadyDeletedError();
  }

  vehicle.deletedAt = new Date();
  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
}

export async function updateVehicle({
                                      licenseNumber = undefined,
                                      defaultDuration = undefined,
                                      approvalStatus = undefined,
                                      vehicleName = undefined
                                    }) {
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new VehicleNotFoundError();
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

  const result = await vehicle.save();
  if (result.defaultDuration === 0) {
    result.status = "Banned";
  } else if (result.approvalStatus) {
    result.status = "Eligible";
  } else {
    result.status = "Pending";
  }

  return result;
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
    };
  } else if (defaultDurationTo !== undefined && defaultDurationTo) {
    queries.defaultDuration = {
      [Op.lte]: defaultDurationTo
    };
  } else if (defaultDurationFrom !== undefined && defaultDurationFrom) {
    queries.defaultDuration = {
      [Op.gte]: defaultDurationFrom
    };
  }
  if (approvalStatus !== undefined && approvalStatus) {
    queries.approvalStatus = approvalStatus;
  }

  const vehicles = await Vehicle.findAll({where: queries});
  vehicles.forEach(vehicle => {
    if (vehicle.defaultDuration === 0) {
      vehicle.status = "Banned";
      return;
    }
    if (vehicle.approvalStatus) {
      vehicle.status = "Eligible";
    } else {
      vehicle.status = "Pending";
    }
  });

  return vehicles;
}

export async function findVehicleLogById(id) {
  if (id === undefined) throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

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
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (entryTime === undefined) throw new NotProvidedError("entryTime");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");
  if (entryTime === null) throw new NullValueError("entryTime");

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new VehicleNotFoundError();
  }

  if (vehicle.defaultDuration === 0) {
    throw new BannedVehicleError();
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
  if (id === undefined) throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

  const log = await findVehicleLogById(id);
  if (!log) {
    throw new VehicleLogNotFoundError();
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
    };
  } else if (entryTimeTo !== undefined && entryTimeTo) {
    queries.entryTime = {
      [Op.lte]: entryTimeTo
    };
  } else if (entryTimeFrom !== undefined && entryTimeFrom) {
    queries.entryTime = {
      [Op.gte]: entryTimeFrom
    };
  }
  if (exitTimeEqual !== undefined) {
    queries.exitTime = exitTimeEqual;
  } else if (exitTimeTo !== undefined && exitTimeFrom !== undefined) {
    queries.exitTime = {
      [Op.between]: [exitTimeFrom, exitTimeTo]
    };
  } else if (exitTimeTo !== undefined) {
    queries.exitTime = {
      [Op.lte]: exitTimeTo
    };
  } else if (exitTimeFrom !== undefined) {
    queries.exitTime = {
      [Op.gte]: exitTimeFrom
    };
  }
  if (allowedDurationEqual !== undefined && allowedDurationEqual) {
    queries.allowedDuration = allowedDurationEqual;
  } else if (allowedDurationTo !== undefined && allowedDurationTo && allowedDurationFrom !== undefined && allowedDurationFrom) {
    queries.allowedDuration = {
      [Op.between]: [allowedDurationFrom, allowedDurationTo]
    };
  } else if (allowedDurationTo !== undefined && allowedDurationTo) {
    queries.allowedDuration = {
      [Op.lte]: allowedDurationTo
    };
  } else if (allowedDurationFrom !== undefined && allowedDurationFrom) {
    queries.allowedDuration = {
      [Op.gte]: allowedDurationFrom
    };
  }

  return await VehicleLog.findAll({where: queries});
}

export async function findVehicleAllegationById(id) {
  if (id === undefined) throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

  const allegation = await VehicleAllegation.findByPk(id);
  if (allegation) {
    return allegation;
  }
  return null;
}

export async function updateVehicleAllegation({id = undefined, comment = undefined}) {
  if (id === undefined) throw new NotProvidedError("id");
  if (id === null) throw new NotProvidedError("id");

  const allegation = await findVehicleAllegationById(id);
  if (!allegation) {
    throw new VehicleAllegationNotFoundError();
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
    };
  } else if (lateDurationTo !== undefined && lateDurationTo) {
    queries.lateDuration = {
      [Op.lte]: lateDurationTo
    };
  } else if (lateDurationFrom !== undefined && lateDurationFrom) {
    queries.lateDuration = {
      [Op.gte]: lateDurationFrom
    };
  }

  return await VehicleAllegation.findAll({where: queries});
}
