const mygroupRoutes = require("./mygroup");
const authRoutes = require("./auth");
const mypageRoutes = require("./mypage");
const mainRoutes = require("./main");
const postsRoutes = require("./posts");
const searchRoutes = require("./search");

const router = (app) => {
  app.use("/auth", authRoutes);
  app.use("/mygroup", mygroupRoutes);
  app.use("/mypage", mypageRoutes);
  app.use("/main", mainRoutes);
  app.use("/posts", postsRoutes);
  app.use("/search", searchRoutes);
};

module.exports = router;
