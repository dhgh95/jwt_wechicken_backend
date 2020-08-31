const express = require("express");
const router = express.Router();

const { additional, googleLogin } = require("../controllers/auth");
const upload = require("../services/upload");
const singleUpload = upload.single("user_thumbnail");

router.post("/additional", singleUpload, additional);
router.post("/login/google", googleLogin);

module.exports = router;
