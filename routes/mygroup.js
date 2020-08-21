const express = require("express");
const mygroupController = require("../controllers/mygroup");
const router = express.Router();

router.get("/", mygroupController.getPageDetails);

module.exports = router;
