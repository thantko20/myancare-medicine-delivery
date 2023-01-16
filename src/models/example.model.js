const { Schema, model } = require('mongoose');

const exampleSchema = new Schema({
  text: String,
});

const Example = model('Example', exampleSchema);

module.exports = Example;
