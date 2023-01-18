const cloudinary = require('../lib/cloudinary');

exports.deleteFile = async (publicId, destroyOptions = {}) => {
  const result = await cloudinary.uploader.destroy(publicId, destroyOptions);
  return result;
};
