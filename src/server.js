/* eslint-disable no-console */
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception occurred. Server will be shutting down.');
  console.log(err);
  process.exit(1);
});

const mongoose = require('mongoose');

const app = require('./app');
const { PORT, MONGODB_URI } = require('./constants');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI, {
    dbName: 'medicine-delivery',
    useNewUrlParser: true,
  })
  .then(() => console.log('Connection to MongoDB established.'));

const server = app.listen(PORT, () =>
  console.log(`Server running on port :${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection occurred. Server will be shutting down.');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
