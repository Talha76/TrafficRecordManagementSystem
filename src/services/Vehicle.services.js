import Vehicle from "../models/Vehicle.model.js";

export async function removeVehicle(licenseNumber) {
  const vehicle = await Vehicle.findByPk(licenseNumber);
  return await vehicle.destroy();
}
