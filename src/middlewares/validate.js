const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const formatValidationErrors = (errors) => {
  const errorsObj = {};
  errors.forEach((err) => {
    errorsObj[err.param] = err.msg;
  });
  return errorsObj;
};

const validate = (validations) =>
  catchAsync(async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw ApiError.badRequest(
        'Validation Error',
        formatValidationErrors(errors.array())
      );
    }

    next();
  });

module.exports = validate;
