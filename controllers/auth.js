const bcrypt = require("bcryptjs");
const { errorGenerator } = require("../utils");
const { googleAuth, createToken } = require("../services/auth");
const { model } = require("../models");

const googleSignUp = async (req, res, next) => {
  try {
    const { googleToken } = req.query;
    const googleUser = googleAuth(googleToken);

    const duplicateUser = await model["Users"].findOne({
      gmail_id: googleUser.sub,
    });
    duplicateUser && errorGenerator("User exists", 404);

    const { sub, email } = googleUser;
    await model["Users"].create({ gmail_id: sub, email });

    res.status(201).json({ message: "SUCCESS", email });
  } catch (err) {
    next(err);
  }
};

const additional = async (req, res, next) => {
  try {
    const { gmail } = req.query;
    const {
      user_name,
      blog_address,
      wecode_nth,
      blog_type,
      introduction,
      user_thumbnail,
    } = req.body;

    const additionalInfo = {
      user_name,
      blog_address,
      blog_type,
      wecode_nth,
      introduction,
      user_thumbnail,
    };
    await model["Users"].update(additionalInfo, { where: { email: gmail } });

    res.status(201).json({ message: "User created!!!" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const googleToken = req.params;
    const googleUser = googleAuth(googleToken);
    const user = await model["Users"].findOne({ gmail_id: googleUser.sub });
    !user && errorGenerator("User not exists", 404);
    const token = createToken(user.id);

    res.status(201).json({ message: "SUCCESS", token });
  } catch (err) {
    next(err);
  }
};

module.exports = { googleSignUp, additional, login };
