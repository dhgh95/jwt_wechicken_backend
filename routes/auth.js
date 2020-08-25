const express = require("express");
const router = express.Router();
const { additional, googleLogin } = require("../controllers/auth");

router.post("/additional", additional);
router.post("/login/google", googleLogin);

module.exports = router;
