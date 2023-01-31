const catchAsync = require('../utils/catchAsync');
const sendSuccessResponse = require('../utils/sendSuccessResponse');
const adminService = require('../services/admin.service');

exports.getAdmins = catchAsync(async (req, res, next) => {
  const admins = await adminService.getAdmins(req.query);
  sendSuccessResponse({ res, data: admins });
});
