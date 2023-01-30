const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const userService = require('../services/users.service');
const {
  ACCESS_TOKEN_EXPIRES,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES,
} = require('../constants');
const ApiError = require('../utils/apiError');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

exports.registerCustomer = catchAsync(async (req, res, next) => {
  const payload = await authService.registerCustomer(req.body, req.file);

  const user = payload.user;

  await emailService.sendRegistrationEmail(user);

  sendTokens(res, payload);
});

exports.loginCustomer = catchAsync(async (req, res, next) => {
  const payload = await authService.loginCustomer(req.body);

  sendTokens(res, payload);
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const admin = await authService.createAdmin(req.body, req.user.role);

  res.status(201).json({
    code: 201,
    data: admin,
  });
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const payload = await authService.loginAdmin(req.body);

  sendTokens(res, payload);
});

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const accessToken = await authService.refreshAccessToken(
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

exports.requestResetPassword = catchAsync(async (req, res, next) => {
  const user = await userService.getUserByEmail(req.body.email);
  const resetToken = await authService.setResetPasswordToken(user);

  const resetURL = `https://www.myancare-medicine.com/reset-password/${resetToken}`;

  try {
    await emailService.sendMessage({
      to: user.email,
      text: resetURL,
    });

    sendSuccessResponse({ res, code: 204 });
  } catch (error) {
    await authService.revertResetPasswordToken(user);
    next(error);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  await authService.resetPassword(req.params.token, req.body.password);

  sendSuccessResponse({ res, code: 204 });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  await authService.updatePassword({
    userId: req.user.id,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  });

  sendSuccessResponse({ res, code: 204 });
});
