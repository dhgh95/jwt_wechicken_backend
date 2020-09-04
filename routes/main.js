const express = require("express");
const router = express.Router();
const { getMainPosts } = require("../controllers/main");
const { isAuth } = require("../middlewares");

router.get("/", isAuth, getMainPosts);

module.exports = router;
