const { Schema, model } = require('mongoose');

const counterSchema = new Schema({
  collectionName: { type: String, unique: true },
  count: { type: Number, default: 0 },
});

const Counter = model('Counter', counterSchema);

module.exports = Counter;
