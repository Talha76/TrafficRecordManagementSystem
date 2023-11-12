import User from "../models/User.model.js";
import Vehicle from "../models/Vehicle.model.js";

export async function findUserById(userId) {
  return (await User.findByPk(userId)).dataValues;
}

export async function findUserByEmail(mail) {
  return (await User.findOne({ where: { mail: mail } })).dataValues;
}

export async function createUser(_id, _name, _mail, _phoneNumber) {
  return (await User.create({
    id: _id,
    name: _name,
    mail: _mail,
    phoneNumber: _phoneNumber
  })).dataValues;
}

export async function updateUser({id=undefined, name=undefined, mail=undefined, phoneNumber=undefined}) {
  if (!id && !mail) {
    throw new Error('Error: Either ID or email must be provided for user update');
  }

  let user;
  if (id) {
    user = await User.findByPk(id);
  } else if (mail) {
    user = await User.findOne({ where: { mail: mail } });
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

  return (await Vehicle.create({
    licenseNumber: licenseNumber,
    defaultDuration: defaultDuration,
    approvalStatus: approvalStatus,
    vehicleName: vehicleName,
    userMail: userMail
  })).dataValues;
}
