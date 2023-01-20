/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const seedUsers = require('./seedUsers');
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
      .catch((error) => {
        console.log(error.message);
        console.log('❌ Seeding failed.');
      })
      .finally(() => {
        mongoose.disconnect().then(() => {
          process.exit(1);
        });
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
  const users = await seedUsers();
}
