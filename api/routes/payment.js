const express = require("express");

const PaymentController = require("../controllers/PaymentController");

const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");

const router = express.Router();

// --- Get all payments
router.get("/", Auth, PaymentController.getAllPayments);
// --- Get payment by ID
router.get("/info/:id", Auth, validateRule("paramID"), validate, PaymentController.getPaymentByID);
// --- Add payment
router.post("/info", Auth, validateRule("addPayment"), validate, PaymentController.addPayment);
// --- Update payment
router.put("/info/:id", Auth, validateRule("updatePayment"), validate, PaymentController.updatePayment);
// --- Delete payment by ID
router.delete("/info/:id", Auth, validateRule("paramID"), validate, PaymentController.deletePayment);
// --- Delete all payments
router.delete("/info/delete", Auth, PaymentController.deleteAllPayments);

module.exports = router;