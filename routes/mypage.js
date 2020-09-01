const express = require("express");
const router = express.Router();

const { isAuth } = require("../middlewares");
const {
  getMyPage,
  modifyMyProfile,
  deleteMyProfile,
} = require("../controllers/mypage");
const upload = require("../services/upload");
const singleUpload = upload.single("user_thumbnail");

router.get("/", isAuth, getMyPage);
router.post("/", isAuth, singleUpload, modifyMyProfile);
router.delete("/", isAuth, deleteMyProfile);

module.exports = router;
