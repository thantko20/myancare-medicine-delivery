const { ADMIN_ROLE_LIST } = require('../constants');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

const restrictUserTypes = (type = 'both') =>
  catchAsync(async (req, res, next) => {
    if (type === 'both') {
      return next();
    }

    if (type !== req?.userType) {
      return next(ApiError.notAuthorized());
    }

    next();
  });

const restrictAdmins = (roles = ADMIN_ROLE_LIST) =>
  catchAsync(async (req, res, next) => {
    if (req.userType === 'customer') {
      return next();
    }
    if (!roles.includes(req.user?.role)) return next(ApiError.notAuthorized());

    next();
  });

module.exports = {
  restrictAdmins,
  restrictUserTypes,
};
