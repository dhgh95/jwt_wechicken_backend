const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("jwt_test", "root", "1", {
  host: "localhost",
  port: 3306,
  logging: false,
  dialect: "mysql",
});

module.exports = sequelize;
