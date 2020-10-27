const {
  getLikedOrBookmarkPosts,
  isLikeOrBookmark,
} = require("../services/posts");
const { Blogs, Blog_type, Users, Dates } = require("../models");

const getPostsLike = async (req, res, next) => {
  try {
    const { id } = req.user;
    const posts = await getLikedOrBookmarkPosts({
      userId: id,
      selectModel: "Likes",
    });

    res.status(200).json({ message: "LIKED", posts });
  } catch (err) {
    next(err);
  }
};

const getPostsBookMarks = async (req, res, next) => {
  try {
    const { id } = req.user;
    const posts = await getLikedOrBookmarkPosts({
      userId: id,
      selectModel: "Bookmarks",
    });

    res.status(200).json({ message: "BOOKMARK", posts });
  } catch (err) {
    next(err);
  }
};

const isPostLike = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { blog_id } = req.params;

    isLikeOrBookmark({
      userId: id,
      blogId: blog_id,
      selectModel: "Likes",
    });

    res.status(200).json({ message: "LIKED" });
  } catch (err) {
    next(err);
  }
};

const isPostBookMark = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { blog_id } = req.params;

    isLikeOrBookmark({
      userId: id,
      blogId: blog_id,
      selectModel: "Bookmarks",
    });

    res.status(200).json({ message: "BOOKMARK" });
  } catch (err) {
    next(err);
  }
};

const getMyPostsView = async (req, res, next) => {
  try {
    const { id } = req.user;

    const myPosts = await Users.findAll({
      where: { id },
      attributes: ["user_name", "user_thumbnail", "wecode_nth"],
      include: [
        { model: Blog_type, attributes: ["type"] },
        {
          model: Blogs,
          attributes: ["title", "subtitle", "thumbnail", "link", "id"],
          include: { model: Dates, attributes: ["date"] },
          order: [[{ model: Dates }, "date", "DESC"]],
        },
      ],
    });

    res.status(200).json({ message: "MY POSTS", myPosts });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPostsLike,
  getPostsBookMarks,
  isPostLike,
  isPostBookMark,
  getMyPostsView,
};
