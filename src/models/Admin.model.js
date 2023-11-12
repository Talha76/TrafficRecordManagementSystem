import {DataTypes} from "sequelize";
import sequelize from "../config/sequelize.config.js";

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "patrol",
    validate: {
      isIn: {
        args: [["patrol", "sco"]],
        msg: "Invalid designation"
      }
    }
  }
}, {
  tableName: 'admins',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Admin;
