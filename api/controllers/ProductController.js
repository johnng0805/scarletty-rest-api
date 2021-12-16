const res = require("express/lib/response");
const { Op } = require("sequelize");
const { Product, Category, Vendor } = require("../../database/models");

exports.getAll = async (req, res, next) => {
    try {
        const product = await Product.findAll();
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getByID = async (req, res, next) => {
    const id = req.params.id;

    try {
        const product = await Product.findOne({
            where: {
                id: id
            }
        });

        if (!product) {
            return res.status(404).json({
                "status": "Product not found"
            });
        }

        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getByVendorID = async (req, res, next) => {
    const vendorID = req.params.id;

    try {
        const products = await Product.findAll({
            where: {
                vendor_id: vendorID
            }
        });

        if (!products) {
            return res.status(400).json({
                "status": "Product not found"
            });
        }

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getByCategoryID = async (req, res, next) => {
    const categoryID = req.params.id;

    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                where: {
                    id: categoryID
                }
            }]
        });

        if (!products) {
            return res.status(404).json({
                "status": "Products not found"
            });
        }

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.add = async (req, res, next) => {
    const { name, description, price, discount, in_stock, vendor_id, category_id } = req.body;

    try {
        const vendor = await Vendor.findOne({
            where: {
                id: vendor_id
            }
        });

        if (!vendor) {
            return res.status(400).json({
                "error": "Invalid vendor"
            });
        }

        const categories = await Category.findAll({
            where: {
                id: {
                    [Op.or]: category_id
                }
            }
        });

        if (!categories) {
            return res.status(404).json({
                "error": "Invalid categories"
            });
        }

        const product = await Product.create({
            name: name,
            description: description,
            price: price,
            discount: discount,
            in_stock: in_stock,
            vendor_id: vendor_id
        });

        product.setCategories(categories);

        return res.status(201).send(product);
    } catch (error) {
        return res.status(500).send(error);
    }
}