const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: subject,
            text: text
        });

    } catch (error) {
        console.log(error, "email not sent");
    }
}

module.exports = sendEmail;