const { Payment_Info, User } = require("../../database/models");

exports.addPayment = async (req, res, next) => {
    const { type, provider, account_number, expiry } = req.body;
    const user_id = req.user.id;

    try {
        let user = await User.findOne({
            where: {
                id: user_id
            }
        });

        if (!user) {
            return res.status(401).json({
                "error": "Invalid token"
            });
        }

        let paymentInfo = await Payment_Info.create({
            user_id: user_id,
            type: type,
            provider: provider,
            account_number: account_number,
            expiry: expiry
        });

        if (!paymentInfo) {
            return res.status(500).json({
                "error": "Could not create payment"
            });
        }

        return res.status(201).send(paymentInfo);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getPaymentByID = async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        let paymentInfo = await Payment_Info.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!paymentInfo) {
            return res.status(404).json({
                "error": "User's payment information not found"
            })
        }

        return res.status(200).send(paymentInfo);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.getAllPayments = async (req, res, next) => {
    const user_id = req.user.user_id;

    try {
        const paymentInfos = await Payment_Info.findAll({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).send(paymentInfos);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.updatePayment = async (req, res, next) => {
    const { type, provider, account_number, expiry } = req.body;
    const user_id = req.user.user_id;
    const { id } = req.params;

    try {
        let paymentInfo = await Payment_Info.findOne({
            where: {
                user_id: user_id,
                id: id
            }
        });

        if (!paymentInfo) {
            return res.status(404).json({
                "error": "Invalid Payment ID"
            });
        }

        paymentInfo.type = type;
        paymentInfo.provider = provider;
        paymentInfo.account_number = account_number;
        paymentInfo.expiry = expiry;

        await paymentInfo.save();

        return res.status(200).send(paymentInfo);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.deletePayment = async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        let paymentInfo = await Payment_Info.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!paymentInfo) {
            return res.status(400).json({
                "error": "Bad request"
            });
        }

        await paymentInfo.destroy();

        return res.status(200).json({
            "status": "Payment deleted"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.deleteAllPayments = async (req, res, next) => {
    const user_id = req.user.user_id;

    try {
        await Payment_Info.destroy({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).json({
            "status": "All payments deleted"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}