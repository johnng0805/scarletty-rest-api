const jwt = require("jsonwebtoken");

const Authenticate = (req, res, next) => {
    let headerToken = req.headers.authorization;

    if (headerToken) {
        try {
            const token = headerToken.split(" ")[1];
            var decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                "error": "unauthenticated"
            });
        }
    } else {
        return res.status(401).json({
            "error": "unauthenticate"
        });
    }
}

module.exports = Authenticate;