const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getAllUsers = async (query) => {
  const usersQuery = new ApiFeatures(User.find(), query);

  const customFilter = {
    name: {
      $regex: query.name || '',
      $options: 'i',
    },
  };

  usersQuery.filter(customFilter).limitFields().sort().paginate();

  const users = await usersQuery.query;

  return users;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw ApiError.badRequest();
  }

  return user;
};

exports.updateUser = async (id, data, avatarFile) => {
  // eslint-disable-next-line no-unused-vars
  if (data.password) {
    throw ApiError.badRequest('Password should not be updated in such way.');
  }

  if (avatarFile) {
    data.avatar = {
      filename: avatarFile.filename,
      url: avatarFile.path,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updatedUser) {
    throw ApiError.badRequest('No user found!');
  }
  return updatedUser;
};

exports.deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};
