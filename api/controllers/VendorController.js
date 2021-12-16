const { Vendor } = require("../../database/models");

exports.getAll = async (req, res, next) => {
    try {
        const vendors = await Vendor.findAll();
        return res.status(200).send(vendors);
    } catch (error) {
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
}

exports.getByID = async (req, res, next) => {
    const id = req.params.id;

    try {
        const vendor = await Vendor.findOne({
            where: {
                id: id
            }
        });

        if (!vendor) {
            return res.status(404).json({
                "error": "Vendor not found"
            });
        }

        return res.status(200).send(vendor);
    } catch (error) {
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
}

exports.getByVendor = async (req, res, next) => {
    const id = req.params.id;

    try {
        const vendor = await Vendor.findOne({
            where: {
                id: id
            }
        });

        if (!vendor) {
            return res.status(404).json({
                "error": "Vendor not found"
            });
        }

        const products = await vendor.getProducts();

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.add = async (req, res, next) => {
    const { name, country, email, description } = req.body;

    try {
        let newVendor = await Vendor.create({
            name: name,
            country: country,
            email: email,
            description: description
        });

        return res.status(201).send(newVendor);
    } catch (error) {
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
}

exports.update = async (req, res, next) => {
    const { name, country, email, description } = req.body;
    const id = req.params.id;

    try {
        await Vendor.update({
            name: name,
            country: country,
            email: email,
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

exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Vendor.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({
            "status": "Vendor deleted"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}