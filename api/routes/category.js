const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const { validateRule, validate } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");

const router = express.Router();

/* --- Get all Categories --- */
router.get("/all", CategoryController.getAll);
/* --- Get by ID --- */
router.get("/id/:id", validateRule("paramID"), validate, CategoryController.getByID);
/* --- Get Products of Category --- */
router.get("/:id", validateRule("paramID"), validate, CategoryController.getByCategory);
/* --- Add Category --- */
router.post("/info", Auth, validateRule("addCategory"), validate, CategoryController.add);
/* --- Update Category --- */
router.put("/info/:id", Auth, validateRule("addCategory"), validate, CategoryController.update);

module.exports = router;