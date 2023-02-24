const express = require("express");
const router = express.Router();
const { checkOTP } = require("../controllers/auth.controller");
router.post("/checkotp", checkOTP);

module.exports = router;
