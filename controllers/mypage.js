const { errorGenerator } = require("../utils");
const { model } = require("../models");

const getMyPage = async (req, res, next) => {
  try {
    const {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
    } = req.user;

    const mypage = {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
    };

    res.status(200).json({ message: "SUCCESS", mypage });
  } catch (err) {
    next(err);
  }
};

const modifyMyProfile = async (req, res, next) => {
  try {
    const { blog_address } = req.body;

    const modifyProfile = {
      user_thumbnail: req.file?.location,
      blog_address,
    };

    const { id } = req.user;
    await model["Users"].update(modifyProfile, { where: { id } });

    res.status(200).json({ message: "MODIFY" });
  } catch (err) {
    next(err);
  }
};

const deleteMyProfile = async (req, res, next) => {
  try {
    const { deleted } = req.query;
    const { id } = req.user;

    if (deleted === "user_thumbnail") {
      await model["Users"].update({ user_thumbnail: null }, { where: { id } });
    }

    if (deleted === "user") {
      await model["Users"].destroy({ where: { id }, force: true });
    }

    res.status(200).json({ message: "DELETE" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyPage,
  modifyMyProfile,
  deleteMyProfile,
};
