/* eslint-disable no-console */
require('dotenv').config();
const { MONGODB_URI } = require('../constants');
const Medicine = require('../models/medicine.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');
const fs = require('fs');

const medicines = JSON.parse(
  fs.readFileSync(`${__dirname}/medicines.json`, 'utf-8')
);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8')
);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      dbName: 'medicine-delivery',
    });
    await Category.deleteMany({});
    await Medicine.deleteMany({});
    console.log('Deleted well');
    await Category.insertMany(categories);
    await Medicine.insertMany(medicines);
    console.log('Data are imported successfully!');
    process.exit(0);
  } catch (err) {
    await mongoose.disconnect();
    console.log(err);
    process.exit(1);
  }
};

start();
