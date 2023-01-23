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
// In seconds
exports.ACCESS_TOKEN_EXPIRES =
  process.env.NODE_ENV === 'production' ? 900 : 86400;
exports.REFRESH_TOKEN_EXPIRES =
  process.env.NODE_ENV === 'production' ? 86400 : 259200;

exports.PAGE_LIMIT = 10;
exports.DEFAULT_SORTING = '-createdAt';
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_SECURE_DELIVERY_URL =
  process.env.CLOUDINARY_SECURE_DELIVERY_URL;

exports.ADMIN_ROLES = {
  superadmin: 'SUPERADMIN',
  admin: 'ADMIN',
  supervisor: 'SUPERVISOR',
  operator: 'OPERATOR',
};
exports.ADMIN_ROLE_LIST = Object.values(this.ADMIN_ROLES);

exports.USER_TYPES = {
  customer: 'customer',
  admin: 'admin',
};
exports.USER_TYPE_LIST = Object.values(this.USER_TYPES);

exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
