const User = require('../models/user.model');
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
