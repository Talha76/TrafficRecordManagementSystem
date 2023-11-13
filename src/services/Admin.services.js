import Admin from "../models/Admin.model.js";

export async function findAdminByEmail(email) {
  if (email === undefined || !email) {
    throw new Error('Error: Email must be provided for admin lookup');
  }

  const user = await Admin.findByPk(email);
  if (user) {
    return user.dataValues;
  }
  return null;
}

export async function createAdmin(email, name, designation) {
  if (email === undefined || name === undefined || designation === undefined
    || !email || !name || !designation) {
    throw new Error('Error: email, name and designation must be provided for admin creation');
  }

  return (await Admin.create({
    email: email,
    name: name,
    designation: designation
  })).dataValues;
}

export async function updateAdmin(email, {name = undefined, designation = undefined}) {
  if (email === undefined || !email) {
    throw new Error('Error: Email must be provided for admin lookup');
  }

  const admin = await findAdminByEmail(email);
  if (!admin) {
    throw new Error('Error: Admin not found');
  }

  if (name !== undefined) admin.name = name;
  if (designation !== undefined) admin.designation = designation;
  return (await admin.save()).dataValues;
}
