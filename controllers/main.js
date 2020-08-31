const { model } = require("../models");

const getMainPosts = async (req, res, next) => {
  try {
    const allPosts = await model["Blogs"].findAll({
      attributes: ["title", "subtitle", "thumbnail", "link", "date_id"],
      include: {
        model: model["Users"],
        attributes: ["user_name", "user_thumbnail"],
        include: { model: model["Blog_type"], attributes: ["type"] },
      },
    });

    let posts = [];

    for (basicPost of allPosts) {
      const { date } = await model["Dates"].findOne({
        where: { id: basicPost.date_id },
        attributes: ["date"],
      });
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
      posts = [...posts, post];
    }

    res.status(200).json({ message: "MAIN", posts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMainPosts };
