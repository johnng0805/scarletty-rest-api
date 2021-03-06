const express = require("express");
const UserController = require("../controllers/UserController");
/* --- Middlewares --- */
const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");
const AuthAdmin = require("../middlewares/AuthAdmin");
const RateLimit = require("../middlewares/RateLimit");

const router = express.Router();

router.post("/register", RateLimit, validateRule("registerUser"), validate, UserController.register);
router.post("/login", RateLimit, validateRule("loginUser"), validate, UserController.login);

router.get("/info/:id", validateRule("paramID"), validate, UserController.getUserByID);
/* --- Protected Routes --- */
router.put("/info/:id", Auth, validateRule("updateUserByID"), validate, UserController.updateUserByID);

router.get("/verify/:user_id/:token", validateRule("verifyUser"), validate, UserController.verify);

router.post("/reset/password", validateRule("email"), validate, UserController.resetPassword);
router.post("/reset/verify/:user_id/:token", validateRule("verifyResetPassword"), validate, UserController.verifyReset);

module.exports = router;