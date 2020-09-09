const {
  getLikedOrBookmarkPosts,
  isLikeOrBookmark,
} = require("../services/posts");

const getPostsLike = async (req, res, next) => {
  try {
    const { id } = req.user;
    const posts = await getLikedOrBookmarkPosts({
      userId: id,
      selectModel: "Likes",
    });

    res.status(201).json({ message: "LIKED", posts });
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

    res.status(201).json({ message: "BOOKMARK", posts });
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

    res.status(201).json({ message: "LIKED" });
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

    res.status(201).json({ message: "BOOKMARK" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPostsLike,
  getPostsBookMarks,
  isPostLike,
  isPostBookMark,
};
