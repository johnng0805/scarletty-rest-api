const db = require("../database/models");

const checkExist = (db, id) => {
    try {
        let model = db.findOne({
            where: {
                id: id
            }
        });

        if (!model) {
            return false;
        }

        return model;
    } catch (error) {
        return error;
    }
}

module.exports = checkExist;