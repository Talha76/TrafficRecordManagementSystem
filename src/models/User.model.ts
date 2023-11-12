import {DataTypes} from "sequelize";
import sequelize from "../config/sequelize.config";

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isStudent: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false,
});

export default User;
