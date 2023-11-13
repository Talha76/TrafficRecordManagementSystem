import User from "../models/User.model.js";

export async function findUserById(id) {
  if (id === undefined || !id) {
    throw new Error('Error: ID must be provided for user lookup');
  }

  const user = await User.findByPk(id);
  if (user) {
    return user.dataValues;
  }
  return null;
}

export async function findUserByEmail(email) {
  if (email === undefined || !email) {
    throw new Error('Error: Email must be provided for user lookup');
  }

  const user = await User.findOne({where: {email: email}});
  if (user) {
    return user.dataValues;
  }
  return null;
}

export async function createUser(id, name, email, phoneNumber) {
  if (id === undefined || name === undefined || email === undefined || phoneNumber === undefined
    || !id || !name || !email || !phoneNumber) {
    throw new Error('Error: ID, name, email and phone number must be provided for user creation');
  }

  return (await User.create({
    id: id,
    name: name,
    email: email,
    phoneNumber: phoneNumber
  })).dataValues;
}

async function findAvailableUser(id, email) {
  if ((id === undefined && email === undefined) || (!id && !email)) {
    throw new Error('Error: Either ID or email must be provided');
  }

  let user;
  if (id !== undefined) {
    user = await User.findByPk(id);
  } else if (email !== undefined) {
    user = await User.findOne({where: {email: email}});
  }
  if (!user) {
    throw new Error('Error: User not found');
  }
  return user;
}

export async function updateUser({id = undefined, name = undefined, email = undefined, phoneNumber = undefined}) {
  const user = await findAvailableUser(id, email);

  if (name !== undefined) user.name = name;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  return (await user.save()).dataValues;
}
