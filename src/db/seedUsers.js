const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const userModel = require('../models/user.model');

const seedUsers = async () => {
  return await seedData({
    model: userModel,
    generateDoc: () =>
      new userModel({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: '12345678',
        _id: faker.database.mongodbObjectId(),
      }),
    size: 100,
  });
};

module.exports = seedUsers;
