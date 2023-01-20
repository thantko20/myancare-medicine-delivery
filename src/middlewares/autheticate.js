const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/jwt');

const autheticate = catchAsync(async (req, res, next) => {
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return next(ApiError.notAuthenticated());
  }

  const { user, userType } = await verifyAccessToken(accessToken);

  req.user = user;
  req.userType = userType;
  next();
});

function getAccessToken(req) {
  let token;
  token = req.cookies?.access_token || getAccessTokenFromHeaders(req.headers);

  return token;
}

function getAccessTokenFromHeaders(headers) {
  if (headers['authorization']?.startsWith('Bearer ')) {
    return headers['authorization'].replace('Bearer ', '');
  }
  return undefined;
}

module.exports = autheticate;
