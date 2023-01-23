const userService = require('../services/users.service');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  req.query.password = undefined;
  const users = await userService.getAllUsers(req.query);

  res.json({
    code: 200,
    data: users,
    count: users.length,
  });
});

exports.getMe = (req, res, next) => {
  if (!req.user) return next(ApiError.badRequest());

  res.json({
    code: 200,
    data: req.user,
  });
};
