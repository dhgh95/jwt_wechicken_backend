const { Users } = require("../models");

const getMyPage = async (req, res, next) => {
  try {
    const {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
      is_group_joined,
    } = req.user;

    const mypage = {
      user_name,
      user_thumbnail,
      gmail,
      blog_address,
      wecode_nth,
      is_group_joined,
    };

    res.status(200).json({ message: "SUCCESS", mypage });
  } catch (err) {
    next(err);
  }
};

const modifyMyProfile = async (req, res, next) => {
  try {
    const { blog_address } = req.body;
    const { leave } = req.query;

    const modifyProfile = {
      user_thumbnail: req.file?.location,
      blog_address,
      is_group_joined: leave === "group" && false,
    };

    const { id } = req.user;
    await Users.update(modifyProfile, { where: { id } });

    res.status(200).json({ message: "MODIFY", profile: req.file?.location });
  } catch (err) {
    next(err);
  }
};

const deleteMyProfile = async (req, res, next) => {
  try {
    const { deleted } = req.query;
    const { id } = req.user;

    if (deleted === "user_thumbnail") {
      await Users.update({ user_thumbnail: null }, { where: { id } });
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
