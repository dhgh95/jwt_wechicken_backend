const express = require("express");
const {
  getPageDetails,
  joinGroup,
  updateGroup,
  createMyGroup,
} = require("../controllers/mygroup");
const { isAuth } = require("../middlewares");
const router = express.Router();

router.get("/", isAuth, getPageDetails);
router.post("/join", isAuth, joinGroup, getPageDetails);
router.post("/update", isAuth, updateGroup, getPageDetails);
router.post("/createMyGroup", isAuth, createMyGroup, getPageDetails);

module.exports = router;
