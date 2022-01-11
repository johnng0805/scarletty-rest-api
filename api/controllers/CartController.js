const { Cart, Cart_Item, Product, sequelize } = require("../../database/models");

exports.getAll = async (req, res, next) => {
    const { cart_id } = req.user;

    try {
        const cart = await Cart.findAll({
            where: {
                id: cart_id
            }
        });

        if (!cart) {
            return res.status(404).json({
                "error": "Cart not found"
            });
        }

        const cartItems = await Cart_Item.findAll({
            where: {
                cart_id: cart_id
            }
        });

        return res.status(200).send(cartItems);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.updateCart = async (req, res, next) => {
    const items = req.body;

    try {
        items.forEach(item => {
            Cart_Item.update({
                product_id: item.product_id,
                quantity: item.quantity
            }, {
                where: {
                    cart_id: req.user.cart_id
                }
            });
        });

        return res.status(200).json({
            "status": "Update successfully"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.addItem = async (req, res, next) => {
    const { product_id, quantity } = req.body;

    try {
        const product = await Product.findOne({
            where: {
                id: product_id
            }
        });

        if (!product) {
            return res.status(400).json({
                "error": "Invalid product"
            });
        }

        const cartItem = await Cart_Item.create({
            product_id: product_id,
            quantity: quantity,
            cart_id: req.user.cart_id
        });

        return res.status(201).send(cartItem);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.removeItem = async (req, res, next) => {
    const items = req.body;

    try {
        items.forEach(item => {
            Cart_Item.destroy({
                where: {
                    product_id: item.product_id,
                    cart_id: req.user.cart_id
                }
            });
        });

        return res.status(200).json({
            "status": "Item removed"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}