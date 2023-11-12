import Admin from "../models/Admin.model.js";

export async function findAdminByEmail(email) {
  const user = await Admin.findByPk(email);
  if (user) {
    return user.dataValues;
  }
  return null;
}
