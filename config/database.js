import Sequelize from 'sequelize';
import connection from './connection';

let databaseVar;

switch (process.env.NODE_ENV) {
  case 'production':
    databaseVar = new Sequelize(
      connection.production.database,
      connection.production.username,
      connection.production.password, {
        host: connection.production.host,
        dialect: connection.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
    break;
  default:
    databaseVar = new Sequelize(
      connection.development.database,
      connection.development.username,
      connection.development.password, {
        host: connection.development.host,
        dialect: connection.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
}
const database = databaseVar;

export default database;
