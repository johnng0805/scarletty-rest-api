const AuthAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        return res.status(401).json({
            "error": "Unauthorized"
        });
    }
}

module.exports = AuthAdmin;