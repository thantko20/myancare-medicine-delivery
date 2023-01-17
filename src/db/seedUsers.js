const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const userModel = require('../models/user.model');

const seedUsers = async () => {
  const userPassword = await bcrypt.hash('12345678', 12);
  return await seedData({
    model: userModel,
    schema: () => ({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: userPassword,
      _id: faker.database.mongodbObjectId(),
    }),
    size: 10,
  });
};

module.exports = seedUsers;
