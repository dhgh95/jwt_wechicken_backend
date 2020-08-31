const moment = require("moment");
const {
  errorGenerator,
  getRandomIntInclusive,
  shuffleArray,
} = require("../utils/");
const { model } = require("../models/");

const getPageDetails = async (req, res, next) => {
  try {
    const { wecode_nth, is_group_joined } = req.user;
    const by_days = {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: [],
      SUN: [],
    };

    if (is_group_joined) {
      const posts = await model["Blogs"].findAll({
        attributes: ["title", "subtitle", "thumbnail", "link", "date_id"],
        include: {
          model: model["Users"],
          where: { wecode_nth },
          attributes: ["user_name", "user_thumbnail"],
          include: { model: model["Blog_type"], attributes: ["type"] },
        },
      });
      const strChangeDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      for (let basicPost of posts) {
        const { date } = await model["Dates"].findOne({
          where: { id: basicPost.date_id },
          attributes: ["date"],
        });
        const day = strChangeDay[moment(date.replace(/\./g, "")).day()];
        const post = {
          title: basicPost.title,
          subtitle: basicPost.subtitle,
          date,
          link: basicPost.link,
          thumbnail: basicPost.thumbnail,
          user_name: basicPost.user.user_name,
          user_profile: basicPost.user.user_thumbnail,
          type: basicPost.user.blog_type.type,
        };
        by_days[day] = [...by_days[day], post];
      }
    }

    res.status(200).json({ message: "GROUP", is_group_joined, by_days });
  } catch (err) {
    next(err);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const { id } = req.user;
    await model["Users"].update({ is_group_joined: true }, { where: { id } });

    res.status(200).json({ message: "JOIN" });
  } catch (err) {
    next(err);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { wecode_nth } = req.user;
    const users = await model["Users"].findAll({
      where: { wecode_nth },
    });
    const links = users.map((user) => {
      user.blog_address;
    });

    // links로 크롤링 시작

    res.status(200).json({ message: "UPDATE SCRAPER" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageDetails,
  joinGroup,
  updateGroup,
};
