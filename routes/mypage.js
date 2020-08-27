const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const { isAuth } = require("../middlewares");
const {
  getMyPage,
  modifyMyProfile,
  deleteMyProfile,
} = require("../controllers/mypage");

router.get("/", isAuth, getMyPage);
router.post("/", isAuth, upload.single("user_thumbnail"), modifyMyProfile);
router.delete("/", isAuth, deleteMyProfile);

module.exports = router;
