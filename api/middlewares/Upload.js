const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

/**
 * Check file type
 * @param {Express.Multer.File} file 
 * @param {Function} cb(error: error, destination: string) 
 * @returns callback
 */
function checkFileType(file, cb) {
    const fileTypes = /jpg|jpeg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb("Not image files", false);
    }
}

module.exports = upload;