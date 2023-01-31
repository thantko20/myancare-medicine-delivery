const catchAsync = require('../utils/catchAsync');
const sendSuccessResponse = require('../utils/sendSuccessResponse');
const adminService = require('../services/admin.service');

exports.getAdmins = catchAsync(async (req, res, next) => {
  const admins = await adminService.getAdmins(req.query);
  sendSuccessResponse({ res, data: admins });
});

exports.getAdminById = catchAsync(async (req, res, next) => {
  const admin = await adminService.getAdminById(req.params.id);

  sendSuccessResponse({ res, data: admin });
});

exports.getMe = (req, res, next) => {
  console.log('Hello');
  sendSuccessResponse({ res, data: req.user });
};
