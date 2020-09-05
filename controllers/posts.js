const { model } = require("../models");

const getPostsLike = async (req, res, next) => {
  try {
    const { id } = req.user;
    const likedPosts = await model["Users"].findOne({
      where: { id },
      attributes: ["user_thumbnail", "blog_type_id"],
      include: {
        model: model["Blogs"],
        as: "like",
        attributes: ["title", "subtitle", "thumbnail", "link", "id", "user_id"],
        include: { model: model["Dates"], attributes: ["date"] },
        through: {
          attributes: ["status"],
          where: { status: true },
        },
      },
    });
    const { type } = await model["Blog_type"].findOne({
      where: { id: likedPosts.blog_type_id },
      attributes: ["type"],
    });

    let posts = [];
    for (let post of likedPosts.like) {
      const { wecode_nth, user_name, user_thumbnail } = await model[
        "Users"
      ].findOne({
        where: { id: post.user_id },
        attributes: ["user_name", "wecode_nth", "user_thumbnail"],
      });
      const likedPost = {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        date: post.date.date,
        link: post.link,
        thumbnail: post.thumbnail,
        user_name,
        user_profile: user_thumbnail,
        nth: wecode_nth,
        type,
        like: true,
      };
      posts = [...posts, likedPost];
    }

    res.status(201).json({ message: "LIKED", posts });
  } catch (err) {
    next(err);
  }
};

const getPostsBookMarks = async (req, res, next) => {
  try {
    const { id } = req.user;
    const bookMarkPosts = await model["Users"].findOne({
      where: { id },
      attributes: ["user_thumbnail", "blog_type_id"],
      include: {
        model: model["Blogs"],
        as: "bookmark",
        attributes: ["title", "subtitle", "thumbnail", "link", "id", "user_id"],
        include: { model: model["Dates"], attributes: ["date"] },
        through: {
          attributes: ["status"],
          where: { status: true },
        },
      },
    });
    const { type } = await model["Blog_type"].findOne({
      where: { id: bookMarkPosts.blog_type_id },
      attributes: ["type"],
    });

    let posts = [];
    for (let post of bookMarkPosts.bookmark) {
      const { wecode_nth, user_name, user_thumbnail } = await model[
        "Users"
      ].findOne({
        where: { id: post.user_id },
        attributes: ["user_name", "wecode_nth", "user_thumbnail"],
      });
      const bookMarkPost = {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        date: post.date.date,
        link: post.link,
        thumbnail: post.thumbnail,
        user_name,
        user_profile: user_thumbnail,
        nth: wecode_nth,
        type,
        bookmark: true,
      };
      posts = [...posts, bookMarkPost];
    }

    res.status(201).json({ message: "BOOKMARK", posts });
  } catch (err) {
    next(err);
  }
};

const postPostLike = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { blog_id } = req.params;

    const likedPost = await model["Likes"].findOne({
      where: { user_id: id, blog_id },
      attributes: ["status"],
    });

    if (likedPost) {
      await model["Likes"].update(
        { status: !likedPost.status },
        { where: { user_id: id, blog_id } }
      );
    }

    if (!likedPost) {
      const likePost = {
        user_id: id,
        blog_id,
      };
      await model["Likes"].create(likePost);
    }

    res.status(201).json({ message: "LIKED" });
  } catch (err) {
    next(err);
  }
};

const postPostBookMark = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { blog_id } = req.params;

    const bookmarkedPost = await model["Bookmarks"].findOne({
      where: { user_id: id, blog_id },
      attributes: ["status"],
    });

    if (bookmarkedPost) {
      await model["Bookmarks"].update(
        { status: !bookmarkedPost.status },
        { where: { user_id: id, blog_id } }
      );
    }

    if (!bookmarkedPost) {
      const likePost = {
        user_id: id,
        blog_id,
      };
      await model["Bookmarks"].create(likePost);
    }

    res.status(201).json({ message: "BOOKMARK" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPostsLike,
  getPostsBookMarks,
  postPostLike,
  postPostBookMark,
};
