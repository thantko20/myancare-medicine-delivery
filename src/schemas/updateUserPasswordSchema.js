const { body } = require('express-validator');

const updateUserPasswordSchema = [
  body('oldPassword').isString(),
  body('newPassword').isString(),
];

module.exports = updateUserPasswordSchema;
