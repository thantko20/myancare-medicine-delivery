const Admin = require('../models/admin.model');
const ApiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');
const { ADMIN_LEVELS } = require('../constants');

exports.getAdmins = async (query) => {
  const api = new ApiFeatures(Admin.find(), query);

  api.filter().limitFields().sort().paginate();

  const admins = await api.query;

  return admins;
};

exports.getAdminById = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw ApiError.badRequest('No admin found.');
  }

  return admin;
};

exports.updateAdminById = async ({ currentAdminRole, id, data }) => {
  if (data.password)
    throw ApiError.badRequest('Password cannot be updated via this endpoint.');

  const admin = await Admin.findById(id);

  const canUpdateAdmin =
    ADMIN_LEVELS[currentAdminRole] < ADMIN_LEVELS[admin.role];

  if (!canUpdateAdmin) {
    throw ApiError.notAuthorized('Cannot update admin');
  }

  if (data.role && ADMIN_LEVELS[currentAdminRole] >= ADMIN_LEVELS[data.role]) {
    throw ApiError.notAuthenticated('Cannot update role.');
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(id, data, { new: true });

  return updatedAdmin;
};

exports.updateMe = async (id, data) => {
  const updatedMe = await Admin.findByIdAndUpdate(id, data, { new: true });

  return updatedMe;
};
