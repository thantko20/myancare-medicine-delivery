const Joi = require('joi');

const schema = Joi.object({
  text: Joi.string().min(2).max(10).required(),
});

module.exports = schema;
