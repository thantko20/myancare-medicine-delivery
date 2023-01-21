const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

categorySchema.index({ text: 'text' });

const Category = model('Category', categorySchema);

module.exports = Category;
