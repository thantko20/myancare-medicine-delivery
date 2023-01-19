const { faker } = require('@faker-js/faker');
const Medicine = require('../models/medicine.model');
const seedData = require('./seedData');

exports.seedMedicines = async () => {
  return await seedData({
    model: Medicine,
    generateDoc: () =>
      new Medicine({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: '12345678',
        _id: faker.database.mongodbObjectId(),
      }),
    size: 100,
  });
};
