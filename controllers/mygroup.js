const moment = require("moment");
const { model } = require("../models/");
const { getRecentPosts } = require("../scraper");

const getPageDetails = async (req, res, next) => {
  try {
    const { gmail, wecode_nth, is_group_joined } = req.user;
    const joinUsers = await model["Users"].findAll({
      where: { wecode_nth, is_group_joined: true },
      attributes: [
        "gmail",
        ["user_name", "name"],
        ["user_thumbnail", "profile"],
      ],
    });

    const myGroup = await model["Wecode_nth"].findOne({
      where: {
        nth: wecode_nth,
      },
      attributes: ["title", "count", "penalty"],
    });
    let myProfile = {};
    let users = [];
    joinUsers.forEach((user) => {
      if (user.gmail === gmail) {
        myProfile = user;
      }
      if (user.gmail !== gmail) {
        users = [...users, user];
      }
    });

    const posts = await model["Blogs"].findAll({
      attributes: ["title", "subtitle", "thumbnail", "link", "date_id"],
      include: {
        model: model["Users"],
        where: { wecode_nth, is_group_joined: true },
        attributes: ["user_name", "user_thumbnail"],
        include: { model: model["Blog_type"], attributes: ["type"] },
      },
    });
    const by_days = {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: [],
      SUN: [],
    };

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

    res.status(200).json({
      message: "GROUP",
      is_group_joined,
      by_days,
      myProfile,
      users,
      myGroup,
    });
  } catch (err) {
    next(err);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const { id } = req.user;
    await model["Users"].update({ is_group_joined: true }, { where: { id } });
    req.user.dataValues = { ...req.user.dataValues, is_group_joined: true };

    next();
  } catch (err) {
    next(err);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.user;

    const {
      blog_address,
      blog_type: { type },
    } = await model["Users"].findOne({
      where: { id },
      attributes: ["blog_address"],
      include: { model: model["Blog_type"], attributes: ["type"] },
    });

    const posts = await getRecentPosts({ url: blog_address, blogType: type });

    for (let post of posts) {
      const [date] = await model["Dates"].findOrCreate({
        where: { date: post.date },
        defaults: { date: post.date },
      });

      const blog = {
        title: post.title,
        subtitle: post.subtitle,
        thumbnail: post.thumbnail,
        link: post.link,
        date_id: date.id,
        user_id: id,
      };

      await model["Blogs"].findOrCreate({
        where: { title: post.title },
        defaults: blog,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

const createOrModifyMyGroup = async (req, res, next) => {
  try {
    const { wecode_nth, id } = req.user;
    const { title, count, penalty } = req.body;

    const createMyGroup = {
      user_id: id,
      title,
      count: Number(count),
      penalty: Number(penalty),
      status: true,
    };

    await model["Wecode_nth"].update(createMyGroup, {
      where: { nth: wecode_nth },
    });

    res.status(200).json({ message: "CREATE GROUP" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageDetails,
  joinGroup,
  updateGroup,
  createOrModifyMyGroup,
};
