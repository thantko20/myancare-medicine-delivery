const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const User = require('../models/user.model');
const Product = require('../models/product.model');
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

const seedProducts = async () => {
  return await seedData({
    model: Product,
    generateDoc: () =>
      new Product({
        name: faker.commerce.product(),
        image: 'adjpfeonk20304fejfojppda',
        price: faker.commerce.price(100, 200, 0),
        description: faker.commerce.productDescription(),
      }),
    size: 30,
  });
};

module.exports = { seedUsers, seedProducts };
