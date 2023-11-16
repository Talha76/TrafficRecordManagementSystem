import sequelize from "./sequelize.config.js";

import Admin from "../models/Admin.model.js";
import User from "../models/User.model.js";
import Vehicle from "../models/Vehicle.model.js";
import VehicleAllegation from "../models/VehicleAllegation.model.js";
import VehicleLog from "../models/VehicleLog.model.js";

await User.sync({alter: true});
await Admin.sync({alter: true});
await Vehicle.sync({alter: true});
await VehicleLog.sync({alter: true});
await VehicleAllegation.sync({alter: true});
await sequelize.sync({alter: true});
