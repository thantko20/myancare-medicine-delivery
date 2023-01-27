const { body } = require('express-validator');

const loginUserSchema = [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 16 })
    .withMessage(
      'Password must have at least 6 characters and 16 characters max.'
    ),
];

module.exports = loginUserSchema;
