const express = require("express");

const DeliveryController = require("../controllers/DeliveryController");

const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");

const router = express.Router();

// --- Get all Addresses
router.get("/", Auth, DeliveryController.getAllAddress);
// --- Get address by ID
router.get("/info/:id", Auth, validateRule("paramID"), validate, DeliveryController.getAddress);
// --- Add address
router.post("/info", Auth, validateRule("addAddress"), validate, DeliveryController.addAddress);
// --- Update address
router.put("/info", Auth, validateRule("updateAddress"), validate, DeliveryController.updateAddress);
// --- Delete address
router.delete("/info/:id", Auth, validateRule("paramID"), validate, DeliveryController.removeAddress);

module.exports = router;