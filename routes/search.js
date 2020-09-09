const express = require("express");
const router = express.Router();

const { search } = require("../controllers/search");
const { isAuth } = require("../middlewares");

router.get("/", isAuth, search);

module.exports = router;
