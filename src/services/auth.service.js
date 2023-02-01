const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ApiError = require('../utils/apiError');
const User = require('../models/user.model');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');
const Admin = require('../models/admin.model');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

exports.registerCustomer = async (data, avatarFile) => {
  const user = await User.create({
    ...data,
    avatar: {
      filename: avatarFile?.filename,
      url: avatarFile?.path,
    },
  });
  user.password = undefined;
  if (!user) {
    throw ApiError.badRequest('There was an error during registering.');
  }

  const tokens = await signTokens({
    userId: user.id,
    userType: USER_TYPES.customer,
  });

  return { user, ...tokens };
};

exports.loginCustomer = async ({ email, password }) => {
  const loginError = ApiError.badRequest('Invalid credentials.');
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw loginError;

  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) throw loginError;

  user.password = undefined;

  const tokens = await signTokens({
    userId: user.id,
    userType: USER_TYPES.customer,
  });

  return { user, ...tokens };
};

exports.createAdmin = async (data, currentUserAdminRole) => {
  const notAuthorizedError = ApiError.notAuthorized();

  if (!currentUserAdminRole) throw notAuthorizedError;

  const isCurrentUserAdminRole = currentUserAdminRole === ADMIN_ROLES.admin;
  const isDataAdminOrSuperadmin =
    data.role === ADMIN_ROLES.admin || data.role === ADMIN_ROLES.superadmin;

  if (isCurrentUserAdminRole && isDataAdminOrSuperadmin) {
    throw notAuthorizedError;
  }

  const admin = await Admin.create({ ...data, password: '12345678' });
  admin.password = undefined;

  return admin;
};

exports.createSuperAdmin = async (data) => {
  if (data.role !== ADMIN_ROLES.superadmin) {
    throw new ApiError('This route is only for creating superadmin', 400);
  }

  const superAdmin = await Admin.create(data);
  superAdmin.password = undefined;
  return superAdmin;
};

exports.loginAdmin = async ({ email, password }) => {
  const loginError = ApiError.badRequest('Invalid credentials.');
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) throw loginError;

  const isValidPassword = await comparePasswords(password, admin.password);
  if (!isValidPassword) throw loginError;

  admin.password = undefined;

  const tokens = await signTokens({
    userId: admin.id,
    userType: USER_TYPES.admin,
  });

  return { user: admin, ...tokens };
};

exports.refreshAccessToken = async (token) => {
  if (!token) throw ApiError.notAuthenticated();

  const { user, userType } = await verifyRefreshToken(token);
  const accessToken = await signAccessToken({ userId: user.id, userType });

  return accessToken;
};

exports.setResetPasswordToken = async (user) => {
  const { resetToken, hashedToken } = createPasswordResetToken();
  const expire = Date.now() + 10 * 60 * 1000; // 10 Minutes

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expire;
  await user.save();

  return resetToken;
};

exports.revertResetPasswordToken = async (user) => {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return user;
};

exports.resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Token Expired.');
  }

  user.password = password;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  return user;
};

exports.updatePassword = async ({ userId, oldPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw ApiError.badRequest('No user found.');
  }

  const isValidPassword = await comparePasswords(oldPassword, user.password);

  if (!isValidPassword) {
    throw ApiError.badRequest('Invalid Password');
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();

  await user.save();

  return user;
};

exports.updateAdminPassword = async ({ userId, oldPassword, newPassword }) => {
  const admin = await Admin.findById(userId).select('+password');
  if (!admin) {
    throw ApiError.badRequest('Admin not found.');
  }

  const isValidPassword = await comparePasswords(oldPassword, admin.password);

  if (!isValidPassword) {
    throw ApiError.badRequest('Wrong password');
  }

  admin.password = newPassword;

  await admin.save();

  return admin;
};

exports.overrideAdminPassword = async (id, password) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw ApiError.badRequest('Admin not found.');
  }

  if (admin.role === ADMIN_ROLES.superadmin) {
    throw ApiError.badRequest("Cannot update superadmin's password.");
  }

  admin.password = password;

  await admin.save();

  return admin;
};

async function comparePasswords(plainText, encrypted) {
  const isValid = await bcrypt.compare(plainText, encrypted);
  return isValid;
}

async function signTokens(payload) {
  const accessToken = await signAccessToken(payload);

  const refreshToken = await signRefreshToken(payload);

  return { accessToken, refreshToken };
}

function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return { resetToken, hashedToken };
}
