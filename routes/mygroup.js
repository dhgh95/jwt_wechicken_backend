const express = require("express");
const {
  getPageDetails,
  joinGroup,
  addPost,
  updateGroup,
  createOrModifyMyGroup,
  getCalendar,
} = require("../controllers/mygroup");
const { isAuth } = require("../middlewares");
const router = express.Router();

router.get("/", isAuth, getPageDetails);
router.get("/calendar/:seleteDate", isAuth, getCalendar);
router.post("/join", isAuth, joinGroup, getPageDetails);
router.post("/addpost", isAuth, addPost, getPageDetails);
router.post("/update", isAuth, updateGroup, getPageDetails);
router.post(
  "/createOrModifyMyGroup",
  isAuth,
  createOrModifyMyGroup,
  getPageDetails
);

module.exports = router;
