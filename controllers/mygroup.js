const Sequelize = require("sequelize");

const { getWeekPosts } = require("../services/mygroup");
const { Wecode, Users, Blog_type, Blogs, Dates } = require("../models/");
const { getRecentPosts } = require("../scraper");

const getPageDetails = async (req, res, next) => {
  try {
    const { gmail, wecode_nth, is_group_joined } = req.user;

    const myGroup = await Wecode.findOne({
      where: {
        nth: wecode_nth,
      },
      attributes: ["title", "count", "penalty"],
    });

    const joinUsers = await Users.findAll({
      where: { wecode_nth, is_group_joined: true },
      attributes: [
        "gmail",
        ["user_name", "name"],
        ["user_thumbnail", "profile"],
      ],
      include: { model: Blog_type, attributes: ["type"] },
    });

    let myProfile = {};
    let users = [];
    joinUsers.forEach((user) => {
      if (user.gmail === gmail) {
        myProfile = {
          gmail: user.gmail,
          name: user.dataValues.name,
          profile: user.dataValues.profile,
          blog_type: user.blog_type.type,
        };
      }
      if (user.gmail !== gmail) {
        users = [...users, user];
      }
    });

    let Ranks = await Blogs.findAll({
      group: ["user_id"],
      attributes: [[Sequelize.fn("COUNT", "user_id"), "user_posts"]],
      order: Sequelize.literal("user_posts DESC"),
      limit: 3,
      include: {
        model: Users,
        where: { wecode_nth, is_group_joined: true },
        attributes: ["user_name", "user_thumbnail"],
      },
    });
    Ranks = Ranks.map((rank) => {
      return {
        user_name: rank.user.user_name,
        user_profile: rank.user.user_thumbnail,
      };
    });

    const { by_days, userPostsCounting } = await getWeekPosts({ wecode_nth });

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
    const { selectedDate } = req.params;

    const { by_days, userPostsCounting } = await getWeekPosts({
      selectedDate,
      wecode_nth,
    });

    res.status(200).json({ message: "CALENDAR", by_days, userPostsCounting });
  } catch (err) {
    next(err);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const { id } = req.user;
    await Users.update({ is_group_joined: true }, { where: { id } });
    req.user.dataValues = { ...req.user.dataValues, is_group_joined: true };

    next();
  } catch (err) {
    next(err);
  }
};

const addPost = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, link, date } = req.body;

    const [findOrCreateDate] = await Dates.findOrCreate({
      where: { date },
      defaults: { date },
    });

    const post = {
      title,
      link,
    };

    const createPost = await Blogs.create(post);
    await findOrCreateDate.addBlog(createPost);
    await user.addBlog(createPost);

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
    } = await Users.findOne({
      where: { id },
      attributes: ["blog_address"],
      include: { model: Blog_type, attributes: ["type"] },
    });

    const posts = await getRecentPosts({ url: blog_address, blogType: type });

    for (let post of posts) {
      const [date] = await Dates.findOrCreate({
        where: { date: post.date },
        defaults: { date: post.date },
      });

      const blog = {
        title: post.title,
        subtitle: post.subtitle,
        thumbnail: post.thumbnail,
        link: post.link,
        dateId: date.id,
        userId: id,
      };

      await Blogs.findOrCreate({
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

    await Wecode.update(createMyGroup, {
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
  addPost,
  updateGroup,
  createOrModifyMyGroup,
  getCalendar,
};
