const { Op } = require("sequelize");
const { Cart, Cart_Item, Order, Order_Item } = require("../../database/models");

exports.checkout = async (req, res, next) => {
    let { cart_items, payment_id, delivery_id } = req.body;
    const { user_id, cart_id } = req.user;

    try {
        let items = await Cart_Item.findAll({
            where: {
                id: {
                    [Op.or]: cart_items
                }
            }
        });

        console.log(items.dataValues.id);

        if (!items) {
            return res.status(404).json({
                "error": "Invalid Cart Item"
            });
        }

        if (items["cart_id"] !== cart_id) {
            return res.status(400).json({
                "error": "Invalid Cart ID"
            });
        }

        return res.status(200).send(items);

        let order = await Order.create({
            user_id: user_id,
            payment_id: payment_id
        });

    } catch (error) {
        return res.status(500).send(error);
    }
}