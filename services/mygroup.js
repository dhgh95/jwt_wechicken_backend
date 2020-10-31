const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { Blogs, Users, Dates, Blog_type } = require("../models");

const getWeekPosts = async ({ selectedDate = false, wecode_nth }) => {
  const weekFistAndLastDay = {
    1: { last: 6 },
    2: { first: 1, last: 5 },
    3: { first: 2, last: 4 },
    4: { first: 3, last: 3 },
    5: { first: 4, last: 2 },
    6: { first: 5, last: 1 },
    0: { first: 6 },
  };
  const seletedWeekDate = selectedDate
    ? selectedDate.match(/[0-9]+/g).join("")
    : moment().format("YYYYMMDD");
  let week = weekFistAndLastDay[moment(seletedWeekDate).day()];

  week = {
    first: moment(seletedWeekDate)
      .subtract(week.first, "d")
      .format("YYYY.MM.DD"),
    last: moment(seletedWeekDate).add(week.last, "d").format("YYYY.MM.DD"),
  };

  const posts = await Blogs.findAll({
    attributes: ["title", "subtitle", "thumbnail", "link", "id"],
    include: [
      {
        model: Users,
        where: { wecode_nth, is_group_joined: true },
        attributes: ["user_name", "user_thumbnail", "gmail"],
        include: { model: Blog_type, attributes: ["type"] },
      },
      {
        model: Dates,
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
    userPostsCounting[basicPost.user.gmail]
      ? (userPostsCounting[basicPost.user.gmail] += 1)
      : (userPostsCounting[basicPost.user.gmail] = 1);
  }

  return { by_days, userPostsCounting };
};

module.exports = { getWeekPosts };
