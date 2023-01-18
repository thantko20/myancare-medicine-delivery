const cloudinary = require('../lib/cloudinary');

const deleteImageFromStorage = async (imageId) => {
  const result = await cloudinary.uploader.destroy(imageId);
  return result;
};

module.exports = deleteImageFromStorage;
