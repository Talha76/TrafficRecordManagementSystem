import User from "../models/User.model.js";
import Vehicle from "../models/Vehicle.model.js";

export async function findUserById(userId) {
  const user = await User.findByPk(userId);
  if (user) {
    return user.dataValues;
  }
  return null;
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    return user.dataValues;
  }
  return null;
}

export async function createUser(id, name, email, phoneNumber) {
  return (await User.create({
    id: id,
    name: name,
    email: email,
    phoneNumber: phoneNumber
  })).dataValues;
}

export async function updateUser({id=undefined, name=undefined, email=undefined, phoneNumber=undefined}) {
  if (!id && !email) {
    throw new Error('Error: Either ID or email must be provided for user update');
  }

  let user;
  if (id) {
    user = await User.findByPk(id);
  } else if (email) {
    user = await User.findOne({ where: { email: email } });
  }
  if (!user) {
    throw new Error('Error: User not found');
  }
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  return (await user.save()).dataValues;
}

export async function addVehicle({userId=undefined, userMail=undefined, licenseNumber, defaultDuration=20, approvalStatus=false, vehicleName=undefined}) {
  if (!userId && !userMail) {
    throw new Error('Error: Either ID or email must be provided for user update');
  }

  let user;
  if (userId) {
    user = await User.findByPk(userId);
  } else if (userMail) {
    user = await User.findOne({ where: { email: userMail } });
  }
  if (!user) {
    throw new Error('Error: User not found');
  }

  return (await Vehicle.create({
    licenseNumber: licenseNumber,
    defaultDuration: defaultDuration,
    approvalStatus: approvalStatus,
    vehicleName: vehicleName,
    userMail: user.email
  })).dataValues;
}

export async function getVehicleList({userId=undefined, userMail=undefined}) {
  if (!userId && !userMail) {
    throw new Error('Error: Either ID or email must be provided for user update');
  }

  let user;
  if (userId) {
    user = await User.findByPk(userId);
  } else if (userMail) {
    user = await User.findOne({ where: { email: userMail } });
  }
  if (!user) {
    throw new Error('Error: User not found');
  }

  const vehicles = await Vehicle.findAll({ where: { userMail: user.email }});
  return vehicles.map(vehicle => vehicle.dataValues);
}
