const express = require("express");
const router = express.Router();

const {
  getPostsLike,
  getPostsBookMarks,
  postPostLike,
  postPostBookMark,
} = require("../controllers/posts");
const { isAuth } = require("../middlewares");

router.get("/likes", isAuth, getPostsLike);
router.get("/bookmarks", isAuth, getPostsBookMarks);
router.post("/likes/:blog_id", isAuth, postPostLike);
router.post("/bookmarks/:blog_id", isAuth, postPostBookMark);

module.exports = router;
