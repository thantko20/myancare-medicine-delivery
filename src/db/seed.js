const mongoose = require('mongoose');

const seedUsers = require('./seedUsers');
const { MONGODB_URI, NODE_ENV } = require('../constants');
const userModel = require('../models/user.model');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI, {
    dbName: 'medicine-delivery',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection to MongoDB established.'));

const dropCollections = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({});
    })
  );
};

async function seed() {
  if (NODE_ENV === 'production')
    throw Error('Seeding should not be done in production mode.');
  console.log('Seeding....');
  await dropCollections();
  const users = await seedUsers();
}

seed()
  .then(() => console.log('Successfully seeded.'))
  .finally(() => {
    mongoose.disconnect();
    console.log('Closed MongoDB');
  });
