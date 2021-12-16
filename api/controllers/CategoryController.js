const { Category } = require("../../database/models");

exports.getAll = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).send(categories);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getByID = async (req, res, next) => {
    const id = req.params.id;

    try {
        const category = await Category.findOne({
            where: {
                id: id
            }
        });

        if (!category) {
            return res.status(404).json({
                "error": "Category not found"
            });
        }

        return res.status(200).send(category);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getByCategory = async (req, res, next) => {
    const id = req.params.id;

    try {
        const category = await Category.findOne({
            where: {
                id: id
            }
        });

        const products = await category.getProducts();

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.add = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const category = await Category.create({
            name: name,
            description: description
        });
        return res.status(201).send(category);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.update = async (req, res, next) => {
    const { name, description } = req.body;
    const id = req.params.id;

    try {
        await Category.update({
            name: name,
            description: description
        }, {
            where: {
                id: id
            }
        });
        return res.status(200).json({
            "status": "Update successfully"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}