import Admin from "../models/Admin.model.js";
import {AdminNotFoundError, NotProvidedError, NullValueError} from "../utils/errors.js";

export async function findAdminByEmail(email) {
  if (email === undefined) throw new NotProvidedError("email");
  if (email === null) throw new NullValueError("email");

  const user = await Admin.findByPk(email);
  if (user) {
    return user;
  }
  return null;
}

export async function createAdmin(email, name, designation) {
  if (email === undefined) throw new NotProvidedError("email");
  if (name === undefined) throw new NotProvidedError("name");
  if (designation === undefined) throw new NotProvidedError("designation");
  if (email === null) throw new NullValueError("email");
  if (name === null) throw new NullValueError("name");
  if (designation === null) throw new NullValueError("designation");

  const [admin] = await Admin.findOrCreate({
    where: {email: email},
    defaults: {
      name: name,
      designation: designation
    }
  });

  return admin;
}

export async function updateAdmin(email, {name = undefined, designation = undefined}) {
  if (email === undefined) throw new NotProvidedError("email");
  if (email === null) throw new NullValueError("email");

  const admin = await findAdminByEmail(email);
  if (!admin) {
    throw new AdminNotFoundError();
  }

  if (name !== undefined) admin.name = name;
  if (designation !== undefined) admin.designation = designation;

  return await admin.save();
}
