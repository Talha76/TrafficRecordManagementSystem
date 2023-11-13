import Vehicle from "../models/Vehicle.model.js";
import VehicleLog from "../models/VehicleLog.model.js";
import VehicleAllegation from "../models/VehicleAllegation.model.js";
import {Op} from "sequelize";

export async function findVehicleByLicenseNumber(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle lookup');
  }

  const vehicle = await Vehicle.findByPk(licenseNumber);
  if (vehicle) {
    return vehicle.dataValues;
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
    if (!vehicle.deletedAt) {
      throw new Error('Error: Vehicle already exists');
    }
  }

  vehicle = await Vehicle.build({
    licenseNumber: licenseNumber,
    vehicleName: vehicleName,
    userMail: userMail
  });
  vehicle.deletedAt = null;
  if (defaultDuration !== undefined) {
    vehicle.defaultDuration = defaultDuration;
  }
  if (approvalStatus !== undefined) {
    vehicle.approvalStatus = approvalStatus;
  }
  return (await vehicle.save()).dataValues;
}

export async function removeVehicle(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle deletion');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (vehicle) {
    if (vehicle.defaultDuration === 0) {
      throw new Error('Error: Banned vehicles cannot be deleted');
    } else {
      vehicle.deletedAt = new Date();
      return (await vehicle.save()).dataValues;
    }
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
  return (await vehicle.save()).dataValues;
}

export async function getVehicleLogs(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle lookup');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new Error('Error: Vehicle not found');
  }

  const logs = await VehicleLog.findAll({where: {licenseNumber: licenseNumber}});
  return logs.map(log => log.dataValues);
}

export async function getVehicleAllegations(licenseNumber) {
  if (licenseNumber === undefined || !licenseNumber) {
    throw new Error('Error: License number must be provided for vehicle lookup');
  }

  const vehicle = await findVehicleByLicenseNumber(licenseNumber);
  if (!vehicle) {
    throw new Error('Error: Vehicle not found');
  }

  const logs = await VehicleLog.findAll({where: {licenseNumber: licenseNumber}});
  logs.map(log => log.dataValues);
  const allegations = [];
  for (const log of logs) {
    const _allegations = await VehicleAllegation.findAll({where: {logId: log.id}});
    allegations.push(..._allegations.map(allegation => allegation.dataValues));
  }

  return allegations;
}

export async function getVehicleList({
                                       userMail = undefined,
                                       defaultDurationEqual = undefined,
                                       defaultDurationMax = undefined,
                                       defaultDurationMin = undefined,
                                       approvalStatus = undefined,
                                     }) {
  const queries = {};
  if (userMail !== undefined && userMail) {
    queries.userMail = userMail;
  }
  if (defaultDurationEqual !== undefined && defaultDurationEqual) {
    queries.defaultDuration = defaultDurationEqual;
  } else if (defaultDurationMax !== undefined && defaultDurationMax && defaultDurationMin !== undefined && defaultDurationMin) {
    queries.defaultDuration = {
      [Op.between]: [defaultDurationMin, defaultDurationMax]
    }
  } else if (defaultDurationMax !== undefined && defaultDurationMax) {
    queries.defaultDuration = {
      [Op.lte]: defaultDurationMax
    }
  } else if (defaultDurationMin !== undefined && defaultDurationMin) {
    queries.defaultDuration = {
      [Op.gte]: defaultDurationMin
    }
  }
  if (approvalStatus !== undefined && approvalStatus) {
    queries.approvalStatus = approvalStatus;
  }

  console.log(queries);

  const vehicles = await Vehicle.findAll({where: queries});
  return vehicles.map(vehicle => vehicle.dataValues);
}
