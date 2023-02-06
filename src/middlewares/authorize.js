const { ADMIN_ROLE_LIST, USER_TYPES, USER_TYPE_LIST } = require('../constants');
const ApiError = require('../utils/apiError');

const authorize = ({ type, adminRoles = ADMIN_ROLE_LIST }) => {
  return (req, res, next) => {
    if (type === 'both') {
      if (
        req.user.role === USER_TYPES.admin &&
        !adminRoles.includes(req.user.role)
      ) {
        return next(
          ApiError.notAuthorized(
            'You are not authorized to perform this action.'
          )
        );
      }
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

module.exports = authorize;
