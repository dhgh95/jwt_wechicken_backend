const express = require("express");
const router = express.Router();
const { googleSignUp, userUpdate, login } = require("../controllers/auth");

router.post("/google", googleSignUp);
router.post("/userUpdate", userUpdate);
router.post("/login", login);

module.exports = router;
