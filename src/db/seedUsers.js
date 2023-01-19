const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const userModel = require('../models/user.model');

const seedUsers = async () => {
  return await seedData({
    model: userModel,
    generateDoc: () =>
      new userModel({
        _id: faker.database.mongodbObjectId(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: '12345678',
        phone: faker.phone.number(),
        address: {
          zipcode: faker.address.zipCode(),
          street: faker.address.street(),
          state: faker.address.state(),
          city: faker.address.city(),
          country: faker.address.country(),
        },
      }),
    size: 100,
  });
};

module.exports = seedUsers;
