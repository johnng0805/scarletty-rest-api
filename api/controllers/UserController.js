const { User, Cart, Activation_Token } = require("../../database/models");
const sendMail = require("../../utils/SendMail");
const crypto = require("crypto");
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

        let token = await Activation_Token.create({
            user_id: newUser.dataValues.id,
            token: crypto.randomBytes(32).toString("hex")
        });

        const message = `${process.env.APP_URL}/api/user/verify/${newUser.dataValues.id}/${token.token}`;
        await sendMail(newUser.dataValues.email, "Scarletty - Verify Email", message);

        return res.status(201).send(newUser);
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.verify = async (req, res, next) => {
    const user_id = req.params.user_id;
    const token = req.params.token;

    try {
        const user = await Activation_Token.findOne({
            where: {
                user_id: user_id,
            }
        });

        if (!user || !token === user.dataValues.token) {
            return res.status(401).json({
                "error": "Invalid link"
            });
        }

        await User.update({
            verified: true
        }, {
            where: {
                id: user_id
            }
        });

        await Activation_Token.destroy({
            where: {
                user_id: user_id
            }
        });

        return res.status(200).json({
            "status": "Email verified"
        });
    } catch (error) {
        return res.status(500).send(error);
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
            return res.status(401).json({
                "error": "Email or password is incorrect"
            });
        }

        if (!user.dataValues.verified) {
            return res.status(401).json({
                "error": "Please verify email address"
            });
        }

        if (user.dataValues.isAdmin) {
            req.session.isAdmin = true;
            req.session.user_id = user.dataValues.id;
        }

        let [cart, created] = await Cart.findOrCreate({
            where: {
                user_id: user.id
            },
            defaults: {
                user_id: user.id
            }
        });

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
        delete user.dataValues["isAdmin"];

        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).json({
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

        if (user.id !== req.user.id) {
            return res.status(401).json({
                "error": "Unauthorized"
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

exports.testEmail = async (req, res, next) => {
    let email = "johnng0805@gmail.com";
    let subject = "Scarletty API";
    let text = "Hello friend...";

    await sendMail(email, subject, text);

    return res.status(200).json({
        "status": "email sent"
    });
}

exports.resetPassword = async (req, res, next) => {
    const { email } = req.body.email;

    try {
        let user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({
                "error": "Invalid email"
            });
        }

        let token = await Activation_Token.create({
            user_id: user.dataValues.id,
            token: crypto.randomBytes(32).toString("hex")
        });

        if (!token) {
            return res.status(500).json({
                "error": "Could not reset password"
            });
        }

        let message = `${process.env.APP_URL}:${process.env.APP_PORT}/api/user/reset/verify/${user.dataValues.id}/${message}`;

        await sendMail(user.dataValues.email, "Scarletty - Reset Password", message);

        return res.status(200).json({
            "status": "Email sent successfully"
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

exports.verifyReset = async (req, res, next) => {
    const { user_id, token } = req.params;
    const { password } = req.body;

    try {
        let userToken = await Activation_Token.findOne({
            where: {
                user_id: user_id
            }
        });

        if (!userToken || token !== userToken.dataValues.token) {
            return res.status(404).json({
                "error": "Invalid Link"
            })
        }

        let hashedPassword = bcrypt.hashSync(password, saltRounds);

        await User.update({
            password: hashedPassword
        }, {
            where: {
                id: user_id
            }
        });

        return res.status(200).json({
            "status": "Password reset successfully"
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}