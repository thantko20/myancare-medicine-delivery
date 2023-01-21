const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

const Category = model('Category', categorySchema);

module.exports = Category;
