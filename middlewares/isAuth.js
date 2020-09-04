const jwt = require("jsonwebtoken");
const { model } = require("../models");
const { errorGenerator } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (token) {
      const { user_id } = jwt.verify(token, process.env.SECRET_KEY);

      const user = await model["Users"].findOne({ where: { id: user_id } });
      !user && errorGenerator("Not found User", "404");

      req.user = user;
    }
    next();
  } catch (err) {
    err.message = "Not authenticated";
    err.statusCode = 401;
    next(err);
  }
};
