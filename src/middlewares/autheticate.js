const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const { ACCESS_TOKEN_SECRET } = require('../constants');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');

const autheticate = catchAsync(async (req, res, next) => {
  const authError = ApiError.notAuthenticated('Not Logged in.');
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return next(authError);
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) return next(authError);

    let user;
    switch (decoded.userType) {
      case 'admin':
        user = await Admin.findById(decoded.userId);
        break;
      case 'customer':
        user = await User.findById(decoded.userId);
        break;
      default:
        next(ApiError.notAuthenticated('You are not authorized.'));
    }

    if (!user) return next(ApiError.badRequest());

    req.user = user;

    next();
  });
});

function getAccessToken(req) {
  let token;
  token = req.cookies?.access_token || getTokenFromHeaders(req.headers);

  return token;
}

function getTokenFromHeaders(headers) {
  if (headers['authorization']?.startsWith('Bearer ')) {
    return headers['authorization'].replace('Bearer ', '');
  }
  return undefined;
}

module.exports = autheticate;
