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
  sendSuccessResponse({ res, data: req.user });
};

exports.updateAdminById = catchAsync(async (req, res, next) => {
  const updatedAdmin = await adminService.updateAdminById({
    id: req.params.id,
    data: req.body,
    currentAdminRole: req.user.role,
  });

  sendSuccessResponse({ res, data: updatedAdmin, code: 201 });
});
