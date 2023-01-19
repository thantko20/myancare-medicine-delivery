const { ADMIN_ROLE_LIST } = require('../constants');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const restrictTo = (onlyUser = false, roles = []) =>
  catchAsync(async (req, res, next) => {
    const notAuthorizedError = ApiError.notAuthorized(
      'You are not authorized to perform this action.'
    );
    if (onlyUser && ADMIN_ROLE_LIST.includes(req.user.role)) {
      return next(notAuthorizedError);
    }

    if (!roles.includes(req.user.role)) {
      return next(notAuthorizedError);
    }

    next();
  });

module.exports = restrictTo;
