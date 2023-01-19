const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const {
  ACCESS_TOKEN_EXPIRES,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES,
} = require('../constants');

exports.registerUser = catchAsync(async (req, res, next) => {
  const user = await authService.registerUser(req.body);
  const { accessToken, refreshToken } = authService.createUserTokens(
    user.id,
    'customer'
  );

  sendTokens(res, { accessToken, refreshToken, user });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const user = await authService.loginUser(req.body);
  const { accessToken, refreshToken } = authService.createUserTokens(
    user.id,
    'customer'
  );

  sendTokens(res, { accessToken, refreshToken, user });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const admin = await authService.createAdmin(req.body, req.user.role);

  res.status(201).json({
    code: 201,
    data: admin,
  });
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const admin = await authService.loginAdmin(req.body);
  const { accessToken, refreshToken } = authService.createUserTokens(
    admin.id,
    'admin'
  );

  sendTokens(res, { accessToken, refreshToken, user: admin });
});

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const accessToken = await authService.validateRefreshToken(
    req.cookies.refresh_token
  );
  res.cookie('access_token', accessToken, {
    maxAge: ACCESS_TOKEN_EXPIRES * 1000,
    httpOnly: true,
    secure: NODE_ENV === 'production',
  });
  res.json({
    code: 200,
    data: accessToken,
  });
});

function sendTokens(res, { accessToken, refreshToken = undefined, user }) {
  res.cookie('access_token', accessToken, {
    maxAge: ACCESS_TOKEN_EXPIRES * 1000,
    httpOnly: true,
    secure: NODE_ENV === 'production',
  });

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRES * 1000,
      httpOnly: true,
      secure: NODE_ENV === 'production',
    });
  }

  res.json({
    code: 200,
    data: { accessToken, user },
  });
}
