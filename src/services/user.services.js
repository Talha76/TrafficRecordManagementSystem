import User from "../models/user.model.js";
import {CustomError, NotProvidedError, NullValueError, UserNotFoundError} from "../utils/errors.js";

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

export async function createUser({id, name, email, phoneNumber}) {
  if (id === undefined) throw new NotProvidedError("id");
  if (name === undefined) throw new NotProvidedError("Name");
  if (email === undefined) throw new NotProvidedError("email");
  if (phoneNumber === undefined) throw new NotProvidedError("phoneNumber");
  if (id === null) throw new NullValueError("id");
  if (name === null) throw new NullValueError("Name");
  if (email === null) throw new NullValueError("email");

  const [user] = await User.findOrCreate({
    where: {id: id},
    defaults: {
      name: name,
      email: email,
      phoneNumber: phoneNumber
    }
  });

  return user;
}

async function findAvailableUser(id, email) {
  if (id === undefined && email === undefined) throw new NotProvidedError("id and/or email");
  if (id === null && email === null) throw new CustomError("id and/or email must be not null");

  let user;
  if (id !== undefined) {
    user = await User.findByPk(id);
  } else if (email !== undefined) {
    user = await User.findOne({where: {email: email}});
  }
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
}

export async function updateUser({id = undefined, name = undefined, email = undefined, phoneNumber = undefined}) {
  if (id === undefined && email === undefined) throw new NotProvidedError("id and/or email");
  if (id === null && email === null) throw new CustomError("id and/or email must be not null");

  try {
    const user = await findAvailableUser(id, email);
    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    return await user.save();
  } catch (err) {
    console.error(err);
  }
}
