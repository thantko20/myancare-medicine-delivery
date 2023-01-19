/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const { seedUsers, seedProducts } = require('./seedUsers');
const { MONGODB_URI, NODE_ENV } = require('../constants');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI, {
    dbName: 'medicine-delivery',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection to MongoDB established.');
    console.log('🌱 Seeding....');
    seed()
      .then(() => console.log('✅ Successfully seeded.'))
      .catch(() => console.log('❌ Seeding failed.'))
      .finally(() => {
        mongoose.disconnect();
      });
  });

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
  await dropCollections();
  // const products = await seedProducts();

  // const reviews = await seedReviews(users);
}
