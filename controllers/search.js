const Sequelize = require("sequelize");
const { model } = require("../models");
const Op = Sequelize.Op;

const search = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const user = req.user;

    const searchPosts = await model["Blogs"].findAll({
      where: {
        title: { [Op.like]: `%${keyword}%` },
      },
      attributes: ["title", "subtitle", "thumbnail", "link", "id"],
      include: [
        {
          model: model["Users"],
          attributes: ["user_name", "user_thumbnail", "wecode_nth"],
          include: { model: model["Blog_type"], attributes: ["type"] },
        },
        { model: model["Dates"], attributes: ["date"] },
      ],
    });

    let posts = [];
    for (searchPost of searchPosts) {
      let isLikedPost = {};
      let isBookMarkedPost = {};
      if (user) {
        isLikedPost = await model["Likes"].findOne({
          where: { user_id: user.id, blog_id: searchPost.id },
          attributes: ["status"],
        });
        isBookMarkedPost = await model["Bookmarks"].findOne({
          where: { user_id: user.id, blog_id: searchPost.id },
          attributes: ["status"],
        });
      }
      const post = {
        id: searchPost.id,
        title: searchPost.title,
        subtitle: searchPost.subtitle,
        link: searchPost.link,
        thumbnail: searchPost.thumbnail,
        user_name: searchPost.user.user_name,
        user_profile: searchPost.user.user_thumbnail,
        nth: searchPost.user.wecode_nth,
        date: searchPost.date.date,
        type: searchPost.user.blog_type.type,
        like: (user && isLikedPost?.status) || false,
        bookmark: (user && isBookMarkedPost?.status) || false,
      };
      posts = [...posts, post];
    }

    res.status(200).json({ message: "SEARCH", posts });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
