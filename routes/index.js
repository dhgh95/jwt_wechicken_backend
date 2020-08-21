const mygroupRoutes = require("./mygroup");
const authRoutes = require("./auth");

const router = (app) => {
  app.use("/auth", authRoutes); // login reponse 토큰 프로필 해당기수제목
  app.use("/mygroup", mygroupRoutes); // 미니카드(블로그, 유저), 10기유저(유저)
};

module.exports = router;
