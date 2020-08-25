const bcrypt = require("bcryptjs");
const { errorGenerator } = require("../utils");
const { googleAuth, createToken } = require("../services/auth");
const { model } = require("../models");

const googleLogin = async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    const googleUser = await googleAuth(googleToken);
    const user = await model["Users"].findOne({
      where: { gmail_id: googleUser.sub },
    });

    if (!user) {
      res.status(201).json({ message: "FIRST" });
    }

    if (user) {
      const token = createToken(user.id, user.wecode_nth);
      res.status(201).json({ message: "SUCCESS", token });
    }
  } catch (err) {
    next(err);
  }
};

const additional = async (req, res, next) => {
  try {
    const {
      user_name,
      blog_address,
      wecode_nth,
      user_thumbnail,
      gmail_id,
    } = req.body;

    await model["Wecode_nth"].findOrCreate({
      where: { nth: wecode_nth },
      default: { nth: wecode_nth },
    });

    const blog_type = blog_address.split("//")[1].split(".")[0];
    const additionalInfo = {
      user_name,
      blog_address,
      blog_type,
      wecode_nth,
      user_thumbnail,
      gmail_id,
    };

    await model["Users"].create(additionalInfo);
    const user = await model["Users"].findOne({ google_id });
    const token = createToken(user.id, user.wecode_nth);

    res.status(201).json({ message: "User created!!!", token });
  } catch (err) {
    next(err);
  }
};

module.exports = { additional, googleLogin };
