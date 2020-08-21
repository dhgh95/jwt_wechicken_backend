require("dotenv").config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const sequelize = require("sequelize");

(async function() {
  try {
    await sequelize;
    console.log("DB CONNECTED");
    server.listen(process.env.PORT, 
      () => {
      console.log(`Server is listening to port: ${process.env.PORT}` )
    })
  } catch (err) {
    console.log("DB CONNECTION ERROR");
    console.log(err)
  }
)()