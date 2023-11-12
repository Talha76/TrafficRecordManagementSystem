import sequelize from "./sequelize.config.js";

import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";
import Vehicle from "../models/Vehicle.model.js";
import VehicleLog from "../models/VehicleLog.model.js";
import VehicleAllegation from "../models/VehicleAllegation.model.js";

// await User.sync({force: true});
await Admin.sync({force: true});
await Vehicle.sync({force: true});
// await VehicleLog.sync({force: true});
// await VehicleAllegation.sync({force: true});
await sequelize.sync({force: true});
