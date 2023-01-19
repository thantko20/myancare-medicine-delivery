const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const User = require('../models/user.model');
const Medicine = require('../models/medicine.model');
const getRandomElementFromArray = require('../utils/getRandomElementFromArray');

const seedUsers = async () => {
  return await seedData({
    model: User,
    generateDoc: () =>
      new User({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: '12345678',
        _id: faker.database.mongodbObjectId(),
      }),
    size: 100,
  });
};

module.exports = { seedUsers };
