const Admin = require('../models/admin.model');
const ApiFeatures = require('../utils/apiFeatures');

exports.getAdmins = async (query) => {
  const api = new ApiFeatures(Admin.find(), query);

  api.filter().limitFields().sort().paginate();

  const admins = await api.query;

  return admins;
};
