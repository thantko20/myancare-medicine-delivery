const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const { MONGODB_URI } = require('../constants');
const userModel = require('../models/user.model');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI, {
    dbName: 'medicine-delivery',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection to MongoDB established.'));

const userPassword = bcrypt.hashSync('12345678', 12);

const users = Array(10)
  .fill()
  .map((item) => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: userPassword,
    _id: faker.database.mongodbObjectId(),
  }));

const seedUsers = async () => {
  await userModel.deleteMany({});
  const dbUsers = await userModel.insertMany(users);
  return dbUsers;
};

async function seed() {
  console.log('Seeding....');
  const dbUsers = await seedUsers();
}

seed()
  .then(() => console.log('Successfully seeded.'))
  .finally(() => {
    mongoose.disconnect();
    console.log('Closed MongoDB');
  });
