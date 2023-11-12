import {Sequelize} from "sequelize";

require('dotenv').config()

export default new Sequelize(process.env.POOL_URI);
