import sequelize from "../config/sequelize.config.js";
import {DataTypes} from "sequelize";
import Vehicle from "./Vehicle.model.js";

const VehicleLog = sequelize.define('VehicleLog', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT"
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "license_number",
    references: {
      model: Vehicle,
      key: 'license_number'
    }
  },
  entryTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "entry_time"
  },
  exitTime: {
    type: DataTypes.DATE,
    field: "exit_time"
  },
  comment: DataTypes.STRING,
  allowedDuration: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 20,
    field: "allowed_duration"
  }
}, {
  tableName: 'vehicle_logs',
  timestamps: false,
});

export default VehicleLog;
