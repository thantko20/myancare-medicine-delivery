/* eslint-disable no-console */
const { NODE_ENV } = require('../constants');
const ApiError = require('../utils/apiError');
const cloudinaryService = require('../services/cloudinary.service');

const deleteFilesInReq = async (req) => {
  if (req.files) {
    await Promise.all(
      req.files.map(
        async (file) => await cloudinaryService.deleteFile(file.filename)
      )
    );
  }

  if (req.file) {
    await cloudinaryService.deleteFile(req.file.filename);
  }
};

function sendApiError(error, res) {
  if (NODE_ENV !== 'production') console.log(error);
  res.status(error.statusCode).json({
    code: error.statusCode,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
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

module.exports = async (error, req, res, next) => {
  ////////////////
  // Foot gun error handling
  try {
    await deleteFilesInReq(req);
  } catch (error) {
    return sendError(error, res);
  }
  //////////////

  if (error instanceof ApiError) {
    return sendApiError(error, res);
  }
  sendError(error, res);
};
