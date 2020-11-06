const mygroupRoutes = require("./mygroup");
const authRoutes = require("./auth");
const mypageRoutes = require("./mypage");
const mainRoutes = require("./main");
const postsRoutes = require("./posts");
const searchRoutes = require("./search");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerOptions = require("../swaggers/swagger")

const specs = swaggerJsdoc(swaggerOptions);
const router = (app) => {
  app.use("/auth", authRoutes);
  app.use("/mygroup", mygroupRoutes);
  app.use("/mypage", mypageRoutes);
  app.use("/main", mainRoutes);
  app.use("/posts", postsRoutes);
  app.use("/search", searchRoutes);
  app.use("/api", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))
};

module.exports = router;
