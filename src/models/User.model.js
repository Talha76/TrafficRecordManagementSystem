import {DataTypes} from "sequelize";
import sequelize from "../config/sequelize.config.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    onUpdate: "RESTRICT",
    onDelete: "RESTRICT"
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "phone_number",
    validate: {
      is: {
        args: /^(\+88)?01[3-9]\d{8}$/,
        msg: "Invalid phone number"
      }
    }
  }
}, {
  tableName: "users",
  timestamps: false,
});

export default User;
