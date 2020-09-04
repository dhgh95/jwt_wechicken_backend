const express = require("express");
const {
  getPageDetails,
  joinGroup,
  updateGroup,
  createOrModifyMyGroup,
} = require("../controllers/mygroup");
const { isAuth } = require("../middlewares");
const router = express.Router();

router.get("/", isAuth, getPageDetails);
router.post("/join", isAuth, joinGroup, getPageDetails);
router.post("/update", isAuth, updateGroup, getPageDetails);
router.post(
  "/createOrModifyMyGroup",
  isAuth,
  createOrModifyMyGroup,
  getPageDetails
);

module.exports = router;
