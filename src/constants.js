/**
 * put all env variables in this file
 * set default or dummy values if necessary
 * eg: SECRET = process.env.SECRET || 'cute_cat'
 */

exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

exports.PAGE_LIMIT = '10';
exports.DEFAULT_SORTING = '-createdAt';
