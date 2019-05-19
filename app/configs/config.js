import * as Sequelize from 'sequelize';

const env = process.env.NODE_ENV || 'development';
import db from  `./config.${env}`;

export const sequelize = new Sequelize(db.database, db.username, db.password, db);
