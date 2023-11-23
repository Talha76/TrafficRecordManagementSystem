import sequelize from "../config/sequelize.config.js";
import {DataTypes} from "sequelize";
import VehicleLog from "./VehicleLog.model.js";

const VehicleAllegation = sequelize.define("vehicle_allegation", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  logId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "log_id",
    references: {
      model: VehicleLog,
      key: "id"
    }
  },
  lateDuration: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
    field: "late_duration"
  },
  comment: DataTypes.STRING,
}, {
  tableName: "vehicle_allegations",
  timestamps: false,
});

export default VehicleAllegation;
