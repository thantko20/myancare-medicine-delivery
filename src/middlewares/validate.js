const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const cloudinaryService = require('../services/cloudinary.service');

const formatValidationErrors = (errors) => {
  const errorsObj = {};
  errors.forEach((err) => {
    errorsObj[err.param] = err.msg;
  });
  return errorsObj;
};

const deleteFilesInReq = async (files) => {
  if (Array.isArray(files) && files.length > 0) {
    await Promise.all(
      files.map(
        async (file) => await cloudinaryService.deleteFile(file.filename)
      )
    );
  } else if (files) {
    await cloudinaryService.deleteFile(files.filename);
  }
};

const validate = (validations) =>
  catchAsync(async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      await deleteFilesInReq(req.files || req.file);
      throw ApiError.badRequest(
        'Validation Error',
        formatValidationErrors(errors.array())
      );
    }

    next();
  });

module.exports = validate;
