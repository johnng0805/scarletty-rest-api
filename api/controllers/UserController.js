const { User, Cart } = require("../../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 12;

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    try {
        let newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        delete newUser.dataValues["password"];

        return res.status(201).send(newUser);
    } catch (error) {
        return res.status(500).json({
            "error": error.errors[0].message,
            "value": error.errors[0].value,
            "path": error.errors[0].path
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).json({
                "error": "Email or password is incorrect"
            });
        }

        let [cart, created] = await Cart.findOrCreate({
            where: {
                user_id: user.id
            },
            defaults: {
                user_id: user.id
            }
        });

        console.log(cart.id);

        const token = await jwt.sign({
            "user_id": user.id,
            "email": user.email,
            "cart_id": cart.id,
        }, process.env.TOKEN_KEY, {
            expiresIn: "2h"
        });

        user.dataValues["token"] = token;
        user.dataValues["token_type"] = "Bearer";

        delete user.dataValues["password"];

        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({
            "error": "Internal server error"
        });
    }
}

exports.getUserByID = async (req, res) => {
    const id = req.params.id;

    try {
        let user = await User.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            res.status(404).json({
                "error": "User not found"
            });
        }

        delete user.dataValues["password"];

        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).json({
            "error": "Internal server error"
        })
    }
}

exports.updateUserByID = async (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(404).json({
                "error": "User not found"
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                "error": "Password incorrect"
            });
        }

        await User.update({
            name: name,
            email: email,
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({
            "status": "Update successfully"
        });
    } catch (error) {
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
}