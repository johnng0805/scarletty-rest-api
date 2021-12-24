const express = require("express");
const dotenv = require("dotenv").config;
const cors = require("cors");
const path = require("path");
const session = require("express-session");
/* --- API Import ---*/
const UserRoutes = require("./api/routes/user");
const CategoryRoutes = require("./api/routes/category");
const VendorRoutes = require("./api/routes/vendor");
const ProductRoutes = require("./api/routes/product");
const CartRoutes = require("./api/routes/cart");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60 * 1000 * 60
    }
}))
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api", router);

/* --- API Routes --- */
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
//--- User
router.use("/user", UserRoutes);
// --- Product Category
router.use("/category", CategoryRoutes);
// --- Product Vendor
router.use("/vendor", VendorRoutes);
// --- Product
router.use("/product", ProductRoutes);
// --- Cart
router.use("/cart", CartRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server starting...");
});