const { body } = require('express-validator');

const schema = [
  body('text')
    .isString()
    .exists()
    .withMessage('`Text` field must be string.')
    .isLength({ min: 2, max: 10 })
    .withMessage('Minimum characters must be 2 and maximum 10'),
];

module.exports = schema;
