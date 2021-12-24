const { Delivery_Address, User } = require("../../database/models");

exports.addAddress = async (req, res, next) => {
    const { address, city, phone } = req.body;
    const user_id = req.user.user_id;

    try {
        let user = await User.findOne({
            where: {
                id: user_id
            }
        });

        if (!user) {
            return res.status(404).json({
                "error": "Invalid token for user"
            });
        }

        if (!user.dataValues.verified) {
            return res.status(401).json({
                "error": "Please verify email before proceeding"
            });
        }

        let userAddress = await Delivery_Address.create({
            user_id: user_id,
            address: address,
            city: city,
            phone: phone
        });

        return res.status(201).send(userAddress);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.updateAddress = async (req, res, next) => {
    const { id, address, city, phone } = req.body;
    const user_id = req.user.user_id;

    try {
        let userAddress = await Delivery_Address.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!address) {
            return res.status(404).json({
                "error": "Address not found"
            });
        }

        userAddress.address = address;
        userAddress.city = city;
        userAddress.phone = phone;

        await userAddress.save();

        return res.status(200).send(userAddress);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.removeAddress = async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        let userAddress = await Delivery_Address.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!userAddress) {
            return res.status(404).json({
                "error": "Address not found"
            });
        }

        await userAddress.destroy();

        return res.status(200).json({
            "status": "Address deleted"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getAllAddress = async (req, res, next) => {
    const user_id = req.user.user_id;

    try {
        let userAddress = await Delivery_Address.findAll({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).send(userAddress);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getAddress = async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        let userAddress = await Delivery_Address.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!userAddress) {
            return res.status(404).json({
                "error": "Address not found"
            });
        }

        return res.status(200).send(userAddress);
    } catch (error) {
        return res.status(500).send(error);
    }
}