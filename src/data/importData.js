require('dotenv').config();
const { MONGODB_URI } = require('../constants');
const Medicine = require('../models/medicine.model');
const mongoose = require('mongoose');
const fs = require('fs');

const medicines = JSON.parse(
  fs.readFileSync(`${__dirname}/medicines.json`, 'utf-8')
);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Medicine.deleteMany();
    console.log('Deleted well');
    await Medicine.create(medicines);
    console.log('Data are imported successfully!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
