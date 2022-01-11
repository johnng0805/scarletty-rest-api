const express = require("express");
const CartController = require("../controllers/CartController");
const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");

const router = express.Router();

// --- Get all Cart Items
router.get("/", Auth, CartController.getAll);
// --- Update Cart Items
router.put("/items", Auth, CartController.updateCart);
// --- Add Item to Cart
router.post("/items", Auth, CartController.addItem);
// --- Delete item
router.delete("/items", Auth, CartController.removeItem);

module.exports = router;