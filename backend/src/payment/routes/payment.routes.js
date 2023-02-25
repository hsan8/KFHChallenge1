const express = require("express");
const { authMiddleware } = require("../../authentication/controllers/auth.controller"); 
const router = express.Router();
const { createPayment,validatePayment } = require("../controllers/payment.controller");

router.post("/makepayment", createPayment);
router.post("/validatepayment", authMiddleware ,validatePayment);

module.exports = router;
