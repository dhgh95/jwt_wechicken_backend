const express = require("express");
const router = express.Router();
const { googleSignUp, additional, login } = require("../controllers/auth");

router.post("/signup/google", googleSignUp);
router.post("/signup/additional", additional);
router.post("/login", login);

module.exports = router;
