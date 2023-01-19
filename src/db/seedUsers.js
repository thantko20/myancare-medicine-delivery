const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const seedData = require('./seedData');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const getRandomElementFromArray = require('../utils/getRandomElementFromArray');

const seedUsers = async () => {
  const userPassword = await bcrypt.hash('12345678', 12);
  return await seedData({
    model: User,
    schema: () => ({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: userPassword,
      _id: faker.database.mongodbObjectId(),
    }),
    size: 10,
  });
};

const seedProducts = async () => {
  return await seedData({
    model: Product,
    schema: () => ({
      name: faker.commerce.product(),
      image: 'adjpfeonk20304fejfojppda',
      price: faker.commerce.price(100, 200, 0),
      description: faker.commerce.productDescription(),
    }),
    size: 30,
  });
};

module.exports = { seedUsers, seedProducts };
