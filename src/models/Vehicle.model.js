import {DataTypes} from "sequelize";
import sequelize from "../config/sequelize.config.js";
import User from "./User.model.js";

const Vehicle = sequelize.define("Vehicle", {
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    field: "license_number",
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT"
  },
  userMail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "user_mail",
    validate: {
      isEmail: true
    },
    references: {
      model: User,
      key: "email"
    },
  },
  defaultDuration: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 20,
    field: "default_duration"
  },
  approvalStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "approval_status"
  },
  vehicleName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "vehicle_name"
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: "deleted_at"
  }
}, {
  tableName: "vehicles",
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default Vehicle;
