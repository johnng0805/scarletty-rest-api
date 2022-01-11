const express = require("express");
const CheckOutController = require("../controllers/CheckoutController");
const Auth = require("../middlewares/Auth");

const router = express.Router();

router.post("/", Auth, CheckOutController.checkout);

module.exports = router;