const {
  errorGenerator,
  getRandomIntInclusive,
  shuffleArray,
} = require("../utils/");
const faker = require("faker");
const mediumPosts = require("../scraper/json/medium.json");
const velogPosts = require("../scraper/json/velog.json");
const days = require("../scraper/days");
const { model } = require("../models/");

const getPageDetails = async (req, res, next) => {
  try {
    const posts = [...mediumPosts, ...velogPosts].map((post) => {
      return {
        ...post,
        user_name: faker.internet.userName().slice(0, 6),
        user_profile: faker.image.avatar(),
      };
    });

    shuffleArray(posts);
    const by_days = {
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: [],
      SUN: [],
    };

    posts.forEach((post) => {
      const day = days[getRandomIntInclusive(1, 7)];
      by_days[day] = [...by_days[day], post];
    });

    const contributors = new Array(10).fill(null).map((_) => {
      return {
        user_name: faker.internet.userName().slice(0, 6),
        user_profile: faker.image.avatar(),
        blog_counts: getRandomIntInclusive(0, 3),
      };
    });

    const myGroupResponse = {
      by_days,
      contributors,
    };

    res.status(200).json(myGroupResponse);
  } catch (err) {
    next(err);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const { id } = rep.user;
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

    res.status(200).json({ message: "SUCCESS" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPageDetails, joinGroup, updateGroup };
