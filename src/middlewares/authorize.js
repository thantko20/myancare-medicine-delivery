const { ADMIN_ROLE_LIST, USER_TYPES, USER_TYPE_LIST } = require('../constants');
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

// entities = [{type, roles}]
const authorize = ({ type, adminRoles = ADMIN_ROLE_LIST }) => {
  return (req, res, next) => {
    if (type === 'both') {
      return next();
    }

    if (!USER_TYPE_LIST.includes(req.userType)) {
      return next(ApiError.notAuthorized('User type not found.'));
    }

    if (type !== req.userType) {
      return next(
        ApiError.notAuthorized('You are not authorized to perform this action.')
      );
    }

    if (type === USER_TYPES.admin && !adminRoles.includes(req.user.role)) {
      return next(ApiError.notAuthorized());
    }

    next();
  };
};

module.exports = {
  restrictAdmins,
  restrictUserTypes,
};
