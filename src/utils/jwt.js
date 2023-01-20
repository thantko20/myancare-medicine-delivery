const jwt = require('jsonwebtoken');

const ApiError = require('./apiError');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
} = require('../constants');

const modelWithTypes = {
  admin: Admin,
  user: User,
};

exports.signAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES },
      (error, token) => {
        if (error) {
          reject(error);
        }

        resolve(token);
      }
    );
  });
};

exports.verifyAccessToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    const authError = ApiError.notAuthenticated('Not Logged in.');

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (error, decoded) => {
      if (error) reject(authError);

      const { userId, userType } = decoded;
      const model = modelWithTypes[userType];

      if (!model) reject(ApiError.notAuthorized());

      const user = await model.findById(userId);

      if (!user) return reject(ApiError.badRequest());
      resolve({ user, userType });
    });
  });
};

exports.signRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES },
      (error, token) => {
        if (error) {
          reject(error);
        }

        resolve(token);
      }
    );
  });
};
