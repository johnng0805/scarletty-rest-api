const express = require("express");
const multer = require("multer");
/* --- Controllers --- */
const ProductController = require("../controllers/ProductController");
const ProductImageController = require("../controllers/ProductImageController");
/* --- Middlewares --- */
const { validateRule, validate } = require("../middlewares/Input");
const Auth = require("../middlewares/Auth");
const upload = require("../middlewares/Upload").any("product_image", 5);

const router = express.Router();

// --- Get All Products
router.get("/all", ProductController.getAll);
// --- Get Product by ID
router.get("/id/:id", validateRule("paramID"), validate, ProductController.getByID);
// --- Get Products of Vendor
router.get("/vendor/:id", validateRule("paramID"), validate, ProductController.getByVendorID);
// --- Get Products of Category
router.get("/category/:id", validateRule("paramID"), validate, ProductController.getByCategoryID);
// --- Get all Product's images
router.get("/:id/images", validateRule("paramID"), validate, ProductImageController.getImages);
// --- Add Product
router.post("/info", Auth, validateRule("addProduct"), validate, ProductController.add);
// --- Add Product's images
router.post("/images", function (req, res, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(413).json({
                "error": err
            });
        } else if (err) {
            return res.status(415).json({
                "error": err
            });
        }
        next();
    });
}, validateRule("addImages"), validate, ProductImageController.addImages);
// --- Delete all Product's images
router.delete("/:id/images", Auth, validateRule("paramID"), validate, ProductImageController.deleteAll);
// --- Delete Product's images by IDs
router.delete("/images/ids", Auth, ProductImageController.deleteByID);

module.exports = router;