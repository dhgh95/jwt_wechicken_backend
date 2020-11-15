const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('jwt', 'root', process.env.MYSQL_PASSWORD, {
  host: "jwt.c5aaxafaq9h8.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  logging: false,
  dialect: 'mysql',
})

module.exports = sequelize
