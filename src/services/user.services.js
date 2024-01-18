import User from "../models/user.model.js";
import {
  CustomError,
  NotProvidedError,
  NullValueError,
  UserNotFoundError,
  VehicleNotFoundError
} from "../utils/errors.js";
import Vehicle from "../models/vehicle.model.js";

export async function findUserById(id) {
  if (id === undefined) throw new NotProvidedError("id");
  if (id === null) throw new NullValueError("id");

  const user = await User.findByPk(id);
  if (user) {
    return user;
  }
  return null;
}

export async function findUserByEmail(email) {
  if (email === undefined) throw new NotProvidedError("email");
  if (email === null) throw new NullValueError("email");

  const user = await User.findOne({where: {email: email}});
  if (user) {
    return user;
  }
  return null;
}

export async function findUserByVehicle(licenseNumber) {
  if (licenseNumber === undefined) throw new NotProvidedError("licenseNumber");
  if (licenseNumber === null) throw new NullValueError("licenseNumber");

  const vehicle = await Vehicle.findOne({where: {licenseNumber: licenseNumber}});
  if (!vehicle) throw new VehicleNotFoundError();
  const user = await User.findOne({where: {email: vehicle.userMail}});
  if (user) {
    return user;
  }
  throw new UserNotFoundError();
}

/**
 * Creates a new user
 * @param opts - {id: number, name: string, email: string, phoneNumber: string}
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
export async function createUser(opts) {
  if (typeof opts.id === "undefined") throw new NotProvidedError("id");
  if (typeof opts.name === "undefined") throw new NotProvidedError("Name");
  if (typeof opts.email === "undefined") throw new NotProvidedError("email");
  if (typeof opts.phoneNumber === "undefined") throw new NotProvidedError("phoneNumber");
  if (opts.id === null) throw new NullValueError("id");
  if (opts.name === null) throw new NullValueError("name");
  if (opts.email === null) throw new NullValueError("email");
  if (opts.phoneNumber === null) throw new NullValueError("phoneNumber");

  const [user] = await User.findOrCreate({
    where: {id: opts.id},
    defaults: {
      name: opts.name,
      email: opts.email,
      phoneNumber: opts.phoneNumber
    }
  });

  return user;
}

async function findAvailableUser(id, email) {
  if (id === null && email === null) throw new CustomError("id and/or email must be not null");

  let user;
  if (id !== null) {
    user = await User.findByPk(id);
  } else if (email !== null) {
    user = await User.findOne({where: {email: email}});
  }
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
}

/**
 * Updates a user
 * @param opts - {id: number, name(optional): string, email: string, phoneNumber(optional): string}
 * @desc Either id or mail must be provided. Both cannot be provided
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
export async function updateUser(opts) {
  if (typeof opts.id === "undefined" && typeof opts.email === "undefined") throw new NotProvidedError("id and/or email");
  if (opts.id === null && opts.email === null) throw new NullValueError("id and/or email");

  try {
    let user;
    if (typeof opts.id !== "undefined") {
      user = await findAvailableUser(opts.id, null);
    } else {
      user = await findAvailableUser(null, opts.email);
    }
    if (typeof opts.name !== "undefined") user.name = opts.name;
    if (typeof opts.phoneNumber !== "undefined") user.phoneNumber = opts.phoneNumber;
    return await user.save();
  } catch (err) {
    console.error(err);
  }
}
