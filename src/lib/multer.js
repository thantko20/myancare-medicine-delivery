const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: function (req, file, cb) {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').slice(-1).pop();
    cb(null, file.fieldname + '-' + suffix + '.' + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
  fileFilter: function (req, file, callback) {
    if (!file.mimetype.startsWith('image')) {
      return callback(ApiError.badRequest('Invalid file type.'), false);
    }

    callback(null, true);
  },
});

module.exports = {
  upload,
};
