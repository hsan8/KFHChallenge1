const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/payment.controller");
router.post("/makepayment", makePayment);

module.exports = router;
