const Admin = require('../models/admin.model');
const ApiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');

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
