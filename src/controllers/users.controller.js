const userService = require('../services/users.service');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  req.query.password = undefined;
  const users = await userService.getAllUsers(req.query);

  sendSuccessResponse({ res, data: users });
});

exports.getMe = (req, res, next) => {
  if (!req.user) return next(ApiError.badRequest());

  sendSuccessResponse({ res, data: req.user });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (!req.user) return next(ApiError.badRequest());

  const updatedUser = await userService.updateUser(req.user.id, req.body);

  sendSuccessResponse({ res, code: 201, data: updatedUser });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  sendSuccessResponse({ res, data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);

  sendSuccessResponse({ res, data: updatedUser, code: 201 });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userService.deleteUser(req.params.id);

  sendSuccessResponse({ res, code: 204 });
});
