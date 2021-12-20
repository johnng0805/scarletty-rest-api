const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {
        "error": "Too many failed attempts"
    }
});

module.exports = limiter;