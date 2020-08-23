const bcrypt = require("bcryptjs");
const { errorGenerator } = require("../utils");
const { googleAuth, createToken } = require("../services/auth");
const { model } = require("../models");

const googleSignUp = async (req, res, next) => {
  try {
    const googleToken = req.params;
    const googleUser = googleAuth(googleToken);
    const duplicateUser = await model["Users"].findOne({ gmail_id: googleUser.sub });
    duplicateUser && errorGenerator("User exists", 404);
    const { sub, email } = googleUser;
    await model["Users"].create({ gmail_id: sub, email });
    const { id } = model["User"].findOne({ gmail_id: googleUser.sub })
    const token = createToken(id)

    res.status(201).json({ message: "User created!!!", token });
  } catch (err) {
    next(err);
  }
};

const additional = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const {
      user_name,
      blog_address,
      wecode_nth,
      blog_type,
      introduction,
      user_thumbnail
    } = req.body;

    const additionalInfo = {
      user_name,
      blog_address,
      blog_type,
      wecode_nth,
      introduction,
      user_thumbnail
    };
    await model['Users'].update(additionalInfo, {where: {id}});

    res.status(201).json({ message: "User created!!!" });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  try {
    const googleToken = req.params;
    const googleUser = googleAuth(googleToken);
    const user = await model["Users"].findOne({ gmail_id: googleUser.sub });
    !user && errorGenerator("User not exists", 404);
    const token = createToken(user.id)

    res.status(201).json({ message: "SUCCESS", token });
  } catch (err) {
    next(err);
  }
};

module.exports = { googleSignUp, additional, login };
