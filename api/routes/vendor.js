const express = require("express");
const { validate, validateRule } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");
const VendorController = require("../controllers/VendorController");
const router = express.Router();

/* --- Get All Vendors --- */
router.get("/all", VendorController.getAll);
/* --- Get Vendor by ID --- */
router.get("/id/:id", validateRule("paramID"), validate, VendorController.getByID);
/* --- Get Products of Vendor --- */
router.get("/:id", validateRule("paramID"), validate, VendorController.getByVendor);
/* --- Register Vendor --- */
router.post("/info", Auth, validateRule("addVendor"), validate, VendorController.add);
/* --- Update Vendor's info --- */
router.put("/info/:id", Auth, validateRule("paramID"), validate, VendorController.update);
/* --- Delete Vendor by ID --- */
router.delete("/info/:id", Auth, validateRule("paramID"), validate, VendorController.delete);

module.exports = router;
