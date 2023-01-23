const multer = require('multer');
const ApiError = require('../utils/apiError');
const cloudinary = require('../lib/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const catchAsync = require('../utils/catchAsync');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images',
    format: 'jpeg',
    public_id: (req, file) => {
      const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').slice(-1).pop();
      const filename = `${file.fieldname}-${suffix}.${ext}`;
      return filename;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 1MB
  },
  fileFilter: function (req, file, callback) {
    if (!file.mimetype.startsWith('image')) {
      return callback(ApiError.badRequest('Invalid file type.'), false);
    }

    callback(null, true);
  },
});

const uploadMedicineImages = upload.array('images', 2);

const toStoreAsStr = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = `${file.path}`;
      req.body.images.push(filename);
    })
  );
  next();
});

module.exports = {
  upload,
  uploadMedicineImages,
  toStoreAsStr,
};
