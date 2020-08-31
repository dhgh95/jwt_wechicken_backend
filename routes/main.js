const express = require("express");
const router = express.Router();
const { getMainPosts } = require("../controllers/main");

router.get("/", getMainPosts);

module.exports = router;
