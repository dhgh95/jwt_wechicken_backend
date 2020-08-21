require("dotenv").config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { sequelize } = require("./models");

(async function () {
  try {
    await sequelize.authenticate();
    await sequelize
      .sync({ force: false, alter: true })
      .then(() => console.log("DB SYNCED"));
    server.listen(process.env.PORT, () => {
      console.log(`Server is listening to port: ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("DB CONNECTION ERROR");
    console.log(err);
  }
})();
