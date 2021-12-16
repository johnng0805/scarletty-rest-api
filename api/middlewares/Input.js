const { body, validationResult, param, query } = require("express-validator");

const validateRule = (method) => {
    switch (method) {
        case "registerUser": {
            return [
                body("name", "Name can only contain letters").notEmpty().matches(/^[a-zA-Z ]+$/),
                body("password", "Password can only contain letters and numbers").notEmpty().isAlphanumeric(),
                body("email", "Invalid email").notEmpty().isEmail().normalizeEmail(),
                body("password_confirmation").custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error("Password confirmation does not match");
                    } else {
                        return true;
                    }
                }),
            ];
        }
        case "loginUser": {
            return [
                body("email", "Email or password is incorrect").notEmpty().isEmail().normalizeEmail(),
                body("password", "Email or password is incorrect").notEmpty().isAlphanumeric(),
            ]
        }
        case "paramID": {
            return [
                param("id", "Invalid parameters").isNumeric(),
            ];
        }
        case "updateUserByID": {
            return [
                body("name", "Name can only contain letters").notEmpty().matches(/^[a-zA-Z ]+$/),
                body("password", "Password incorrect").notEmpty().isAlphanumeric(),
                body("email", "Invalid email").notEmpty().isEmail(),
            ];
        }
        case "addVendor": {
            return [
                body("name", "Name can only contain letters, numbers and spacing").notEmpty().matches(/^[0-9a-zA-Z ]+$/),
                body("country", "Invalid country name").notEmpty().matches(/^[a-zA-Z ]+$/),
                body("email", "Invalid email format").notEmpty().isEmail().normalizeEmail(),
                body("description").notEmpty().trim().escape()
            ]
        }
        case "addCategory": {
            return [
                body("name", "Name can only contain letters, numbers and spacing").notEmpty().matches(/^[0-9a-zA-Z ]+$/),
                body("description").notEmpty().trim().escape()
            ]
        }
        case "addProduct": {
            return [
                body("vendor_id", "Invalid vendor parameter").notEmpty().matches(/^[0-9;]+$/),
                body("category_id", "Invalid category parameter").notEmpty().isArray(),
                body("name", "Name can only contain letters, numbers and spacing").notEmpty().matches(/^[0-9a-zA-Z ]+$/),
                body("description").notEmpty().trim().escape(),
                body("price").notEmpty().isFloat(),
                body("discount").optional({ checkFalsy: true }).isFloat(),
                body("in_stock").notEmpty().isNumeric()
            ]
        }
        case "addImages": {
            return [
                body("product_id").notEmpty().isNumeric()
            ]
        }
    }
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }
    next();
}

module.exports = {
    validateRule,
    validate
};