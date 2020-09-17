const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test", "root", process.env.MYSQL_PASSWORD, {
  host: "localhost",
  port: 3306,
  logging: false,
  dialect: "mysql",
});

module.exports = sequelize;
