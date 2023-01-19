const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const userModel = require('../models/user.model');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} = require('../constants');

exports.registerUser = async (data) => {
  const user = await userModel.create(data);
  user.password = undefined;
  if (!user) {
    throw ApiError.badRequest('There was an error during registering.');
  }

  return user;
};

exports.createUserTokens = (userId) => {
  const accessToken = generateAccessToken({
    userId,
    userType: 'customer',
  });
  const refreshToken = generateRefreshToken();

  return { accessToken, refreshToken };
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
