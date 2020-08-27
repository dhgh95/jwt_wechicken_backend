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
const { additional, googleLogin } = require("../controllers/auth");

router.post("/additional", upload.single("user_thumbnail"), additional);
router.post("/login/google", googleLogin);

module.exports = router;
