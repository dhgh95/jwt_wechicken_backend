const jwt = require("jsonwebtoken");
const { model } = require("../models");
const { errorGenerator } = require("../utils");

module.exports = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await model("Users").findOne({ id });
    !user && errorGenerator("Not found User", "404");
  } catch (err) {
    err.message = "Not authenticaed";
    err.statusCode = 401;
    next(err);
  }
};
