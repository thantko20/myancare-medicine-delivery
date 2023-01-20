const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ApiError = require('../utils/apiError');
const User = require('../models/user.model');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  ADMIN_ROLES,
  USER_TYPES,
} = require('../constants');
const Admin = require('../models/admin.model');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

exports.registerCustomer = async (data) => {
  const user = await User.create(data);
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

exports.createUserTokens = (userId, userType) => {
  const accessToken = generateAccessToken({
    userId,
    userType,
  });
  const refreshToken = generateRefreshToken({ userId, userType });

  return { accessToken, refreshToken };
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

exports.validateRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) reject(ApiError.notAuthenticated('Please log in again.'));
    jwt.verify(token, REFRESH_TOKEN_SECRET, async (error, decoded) => {
      if (error) reject(ApiError.notAuthenticated('Please log in again.'));

      let user;
      switch (decoded.userType) {
        case 'admin':
          user = await Admin.findById(decoded.userId);
          break;
        case 'customer':
          user = await User.findById(decoded.userId);
          break;
        default:
          reject(ApiError.notAuthenticated('You are not authorized.'));
      }
      user.type = decoded.userType;
      resolve(
        generateAccessToken({
          userId: decoded.userId,
          userType: decoded.userType,
        })
      );
    });
  });
};

function generateAccessToken(payload) {
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  return token;
}

function generateRefreshToken(payload = {}) {
  const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
  return token;
}

async function comparePasswords(plainText, encrypted) {
  const isValid = await bcrypt.compare(plainText, encrypted);
  return isValid;
}

async function signTokens(payload) {
  const accessToken = await signAccessToken(payload);

  const refreshToken = await signRefreshToken(payload);

  return { accessToken, refreshToken };
}