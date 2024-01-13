import Admin from "../models/admin.model.js";
import {AdminNotFoundError, NotProvidedError, NullValueError} from "../utils/errors.js";
import {Op} from "sequelize";
import VehicleLog from "../models/vehicle-log.model.js";

export async function findAdminByEmail(email) {
  if (email === undefined) throw new NotProvidedError("email");
  if (email === null) throw new NullValueError("email");

  const user = await Admin.findByPk(email);
  if (user) {
    return user;
  }
  return null;
}

/**
 * Creates a new admin
 * @param opts - {email: string, name: string, designation: string}
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
export async function createAdmin(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.email === "undefined") throw new NotProvidedError("email");
  if (typeof opts.name === "undefined") throw new NotProvidedError("name");
  if (typeof opts.designation === "undefined") throw new NotProvidedError("designation");
  if (opts.email === null) throw new NullValueError("email");
  if (opts.name === null) throw new NullValueError("name");
  if (opts.designation === null) throw new NullValueError("designation");

  const [admin] = await Admin.findOrCreate({
    where: {email: opts.email},
    defaults: {
      name: opts.name,
      designation: opts.designation
    }
  });

  return admin;
}

/**
 * Updates an existing admin
 * @param opts - {email(required): string, name: string, designation: string}
 * @returns {Promise<Model<any, TModelAttributes>>}
 * @throws AdminNotFoundError
 */
export async function updateAdmin(opts) {
  if (typeof opts === "undefined") opts = {};
  if (typeof opts.email === "undefined") throw new NotProvidedError("email");
  if (opts.email === null) throw new NullValueError("email");

  const admin = await findAdminByEmail(opts.email);
  if (!admin) {
    throw new AdminNotFoundError();
  }

  if (typeof opts.name !== "undefined") admin.name = opts.name;
  if (typeof opts.designation !== "undefined") admin.designation = opts.designation;

  return await admin.save();
}

export async function findVehiclesStayingUpto(currentTime) {
  if (currentTime === undefined) throw new NotProvidedError("currentTime");
  if (currentTime === null) throw new NullValueError("currentTime");
  if (currentTime instanceof String) currentTime = new Date(currentTime);

  currentTime.setHours(currentTime.getHours() + 6);

  return await VehicleLog.findAll({
    where: {
      entryTime: {
        [Op.lte]: currentTime
      },
      exitTime: null
    }
  });
}
