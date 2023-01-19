/**
 * put all env variables in this file
 * set default or dummy values if necessary
 * eg: SECRET = process.env.SECRET || 'cute_cat'
 */

exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_SECURE_DELIVERY_URL =
  process.env.CLOUDINARY_SECURE_DELIVERY_URL;
