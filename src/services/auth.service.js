const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const userModel = require('../models/user.model');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../constants');

exports.registerUser = async (data) => {
  const user = await userModel.create(data);
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
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
  return token;
}

function generateRefreshToken(payload = {}) {
  const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
  return token;
}
