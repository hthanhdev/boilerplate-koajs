"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { cfg } = require("../config");
const { getLogger } = require("../services/logger");

const logger = getLogger("database");
const basename = path.basename(__filename);
const db = {};

let sequelize = new Sequelize(
  cfg("DB_NAME"),
  cfg("DB_USERNAME"),
  cfg("DB_PASSWORD"),
  {
    host: cfg("DB_HOST"),
    dialect: cfg("DB_DRIVER"),
    port: cfg("DB_PORT"),
    dialectOptions: {
      useUTC: false,
    },
    timezone: cfg("DB_TIMEZONE"),
    logging: cfg("DB_LOGGING") == "true" ? logger.sql : false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info(
      `Connection(${cfg("DB_DRIVER")}) has been established successfully.`
    );
  })
  .catch((err) => {
    logger.error(
      `(${cfg("DB_DRIVER")}) Unable to connect to the database: \n%o`,
      err
    );
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
