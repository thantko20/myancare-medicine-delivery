const cloudinary = require('../lib/cloudinary');

exports.deleteFile = async (publicId, destroyOptions = {}) => {
  const result = await cloudinary.uploader.destroy(publicId, destroyOptions);
  return result;
};

exports.deleteFilesInReq = async (req) => {
  if (req.files) {
    await Promise.all(
      req.files.map(async (file) => await this.deleteFile(file.filename))
    );
  }

  if (req.file) {
    await this.deleteFile(req.file.filename);
  }
};
