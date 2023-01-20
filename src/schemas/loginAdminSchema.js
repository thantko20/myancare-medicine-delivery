const { body } = require('express-validator');

const loginAdminSchema = [
  body('email').isString().isEmail().withMessage('Invalid Email'),
  body('password')
    .isString()
    .isLength({ min: 6, max: 8 })
    .withMessage(
      'Password must have at least 6 characters and 16 characters max.'
    ),
];

module.exports = loginAdminSchema;
