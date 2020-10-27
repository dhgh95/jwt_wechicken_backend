const express = require("express");
const router = express.Router();

const {
  getPostsLike,
  getPostsBookMarks,
  isPostLike,
  isPostBookMark,
  getMyPostsView,
} = require("../controllers/posts");
const { isAuth } = require("../middlewares");

router.get("/likes", isAuth, getPostsLike);
router.get("/bookmarks", isAuth, getPostsBookMarks);
router.get("/myposts", isAuth, getMyPostsView);
router.post("/likes/:blog_id", isAuth, isPostLike);
router.post("/bookmarks/:blog_id", isAuth, isPostBookMark);

module.exports = router;
