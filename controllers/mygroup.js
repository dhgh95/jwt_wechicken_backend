const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
const { model } = require("../models/");
const { getRecentPosts } = require("../scraper");

const getPageDetails = async (req, res, next) => {
  try {
    const { gmail, wecode_nth, is_group_joined } = req.user;

    const myGroup = await model["Wecode_nth"].findOne({
      where: {
        nth: wecode_nth,
      },
      attributes: ["title", "count", "penalty"],
    });

    const joinUsers = await model["Users"].findAll({
      where: { wecode_nth, is_group_joined: true },
      attributes: [
        "gmail",
        ["user_name", "name"],
        ["user_thumbnail", "profile"],
      ],
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

    let Ranks = await model["Blogs"].findAll({
      group: ["user_id"],
      attributes: [[Sequelize.fn("COUNT", "user_id"), "user_posts"]],
      order: Sequelize.literal("user_posts DESC"),
      limit: 3,
      include: {
        model: model["Users"],
        where: { wecode_nth },
        attributes: ["user_name", "user_thumbnail"],
      },
    });
    Ranks = Ranks.map((rank) => {
      return {
        user_name: rank.user.user_name,
        user_profile: rank.user.user_thumbnail,
      };
    });

    const weekFistAndLastDay = {
      1: { last: 6 },
      2: { first: 1, last: 5 },
      3: { first: 2, last: 4 },
      4: { first: 3, last: 3 },
      5: { first: 4, last: 2 },
      6: { first: 5, last: 1 },
      0: { first: 6 },
    };
    let week = weekFistAndLastDay[moment().day()];
    week = {
      first: moment().subtract(week.first, "d").format("YYYY.MM.DD"),
      last: moment().add(week.last, "d").format("YYYY.MM.DD"),
    };

    const posts = await model["Blogs"].findAll({
      attributes: ["title", "subtitle", "thumbnail", "link", "id"],
      include: [
        {
          model: model["Users"],
          where: { wecode_nth, is_group_joined: true },
          attributes: ["user_name", "user_thumbnail", "gmail"],
          include: { model: model["Blog_type"], attributes: ["type"] },
        },
        {
          model: model["Dates"],
          where: {
            date: {
              [Op.and]: { [Op.gte]: week.first, [Op.lte]: week.last },
            },
          },
          attributes: ["date"],
        },
      ],
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
    let userPostsCounting = {};

    const strChangeDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (let basicPost of posts) {
      const day =
        strChangeDay[moment(basicPost.date.date.replace(/\./g, "")).day()];
      const post = {
        id: basicPost.id,
        title: basicPost.title,
        subtitle: basicPost.subtitle,
        date: basicPost.date.date,
        link: basicPost.link,
        thumbnail: basicPost.thumbnail,
        user_name: basicPost.user.user_name,
        user_profile: basicPost.user.user_thumbnail,
        type: basicPost.user.blog_type.type,
      };
      by_days[day] = [...by_days[day], post];
      if (basicPost.user.gmail === gmail) {
        myProfile = {
          ...myProfile,
          postsCount: myProfile.postsCount ? (myProfile.postsCount += 1) : 1,
        };
      }
      if (basicPost.user.gmail !== gmail) {
        userPostsCounting[basicPost.user.gmail]
          ? (userPostsCounting[basicPost.user.gmail] += 1)
          : (userPostsCounting[basicPost.user.gmail] = 1);
      }
    }

    res.status(200).json({
      message: "GROUP",
      is_group_joined,
      by_days,
      myProfile,
      users,
      myGroup,
      userPostsCounting,
      Ranks,
    });
  } catch (err) {
    next(err);
  }
};

const getCalendar = async (req, res, next) => {
  try {
    const { wecode_nth } = req.user;
    const { seleteDate } = req.params;

    const weekFistAndLastDay = {
      1: { last: 6 },
      2: { first: 1, last: 5 },
      3: { first: 2, last: 4 },
      4: { first: 3, last: 3 },
      5: { first: 4, last: 2 },
      6: { first: 5, last: 1 },
      0: { first: 6 },
    };
    let week =
      weekFistAndLastDay[moment(seleteDate.match(/[0-9]+/g).join("")).day()];

    week = {
      first: moment(seleteDate.match(/[0-9]+/g).join(""))
        .subtract(week.first, "d")
        .format("YYYY.MM.DD"),
      last: moment(seleteDate.match(/[0-9]+/g).join(""))
        .add(week.last, "d")
        .format("YYYY.MM.DD"),
    };

    const posts = await model["Blogs"].findAll({
      attributes: ["title", "subtitle", "thumbnail", "link", "id"],
      include: [
        {
          model: model["Users"],
          where: { wecode_nth, is_group_joined: true },
          attributes: ["user_name", "user_thumbnail"],
          include: { model: model["Blog_type"], attributes: ["type"] },
        },
        {
          model: model["Dates"],
          where: {
            date: {
              [Op.and]: { [Op.gte]: week.first, [Op.lte]: week.last },
            },
          },
          attributes: ["date"],
        },
      ],
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
      const day =
        strChangeDay[moment(basicPost.date.date.replace(/\./g, "")).day()];
      const post = {
        id: basicPost.id,
        title: basicPost.title,
        subtitle: basicPost.subtitle,
        date: basicPost.date.date,
        link: basicPost.link,
        thumbnail: basicPost.thumbnail,
        user_name: basicPost.user.user_name,
        user_profile: basicPost.user.user_thumbnail,
        type: basicPost.user.blog_type.type,
      };
      by_days[day] = [...by_days[day], post];
    }

    res.status(200).json({ message: "CALENDAR", by_days });
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
  getCalendar,
};
