/* eslint-disable no-console */
const { NODE_ENV } = require('../constants');
const ApiError = require('../utils/apiError');

function sendApiError(error, res) {
  if (NODE_ENV !== 'production') console.log(error);
  res.status(error.statusCode).json({
    code: error.statusCode,
    message: error.message,
    ...(NODE_ENV !== 'production' && { stack: error.stack }),
  });
}

function sendError(error, res) {
  console.error(error);
  res.status(500).json({
    code: 500,
    message:
      NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    ...(NODE_ENV !== 'production' && { stack: error.stack }),
  });
}

module.exports = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return sendApiError(error, res);
  }
  sendError(error, res);
};
