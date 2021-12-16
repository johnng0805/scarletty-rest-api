const { Product_Image, Product } = require("../../database/models");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getImages = async (req, res, next) => {
    const id = req.params.id;

    try {
        const product = await Product.findOne({
            where: {
                id: id
            }
        });

        if (!product) {
            return res.status(404).json({
                "error": "Product not found"
            });
        }

        const images = await product.getProduct_Images();

        return res.status(200).send(images);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.addImages = async (req, res, next) => {
    const { product_id } = req.body;

    try {
        const product = await Product.findOne({
            where: {
                id: product_id
            }
        });

        if (!product) {
            return res.status(404).json({
                "error": "Product not found"
            });
        }

        let images = [];

        req.files.forEach(file => {
            images.push({ "product_id": product_id, "image": file.filename });
        });

        const productImages = await Product_Image.bulkCreate(images);

        return res.status(201).send(productImages);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.deleteAll = async (req, res, next) => {
    const product_id = req.params.id;

    try {
        const images = await Product_Image.findAll({
            attributes: [
                "image"
            ],
            where: {
                product_id: product_id
            }
        });

        console.log(images);

        if (!images) {
            return res.status(200).json({
                "status": "No images to delete"
            });
        }

        images.forEach(image => {
            console.log(image);
            fs.unlink("./public/uploads/" + image.dataValues.image, err => {
                if (err) {
                    console.log("error:" + err);
                } else {
                    console.log("Deleting: " + image);
                }
            });
        });

        await Product_Image.destroy({
            where: {
                product_id: product_id
            }
        });

        return res.status(200).json({
            "status": "Images deleted"
        });
    } catch (error) {
        return res.status(500).json({
            "error": error
        });
    }
}

exports.deleteByID = async (req, res, next) => {
    const product_id = req.body.product_id;
    const imageIDs = req.body.image_id;

    try {
        const images = await Product_Image.findAll({
            attributes: [
                "image"
            ],
            where: {
                product_id: product_id,
                id: {
                    [Op.or]: imageIDs
                }
            }
        });

        if (!images) {
            return res.status(304).json({
                "status": "Nothing to delete"
            });
        }

        images.forEach(image => {
            fs.unlink("./public/uploads/" + image.dataValues.image, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Deleting: " + image);
                }
            });
        });

        await Product_Image.destroy({
            where: {
                product_id: product_id,
                id: {
                    [Op.or]: imageIDs
                }
            }
        });

        return res.status(200).json({
            "status": "Deleted successfully"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}