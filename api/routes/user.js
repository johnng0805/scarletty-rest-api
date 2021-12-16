const express = require("express");
const bodyParser = require("body-parser");
const UserController = require("../controllers/UserController");
/* --- Middlewares --- */
const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", validateRule("registerUser"), validate, UserController.register);
router.post("/login", validateRule("loginUser"), validate, UserController.login);

/* --- Protected Routes --- */
router.get("/info/:id", Auth, validateRule("paramID"), validate, UserController.getUserByID);
router.put("/info/:id", Auth, validateRule("updateUserByID"), validate, UserController.updateUserByID);

module.exports = router;