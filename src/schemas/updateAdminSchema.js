const { body } = require('express-validator');

const Admin = require('../models/admin.model');

const updateAdminSchema = [
  body('name')
    .isString()
    .withMessage('Name must be text')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      'Name must have at least 2 characters and is 50 characters long at most.'
    )
    .isAlphanumeric('en-US', { ignore: ' ' })
    .escape()
    .optional(),

  body('email')
    .isEmail()
    .withMessage('Must provide an email')
    .trim()
    .custom(async (value) => {
      const user = await Admin.findOne({ email: value });
      if (user) {
        return Promise.reject('Email already exists.');
      }
      return true;
    })
    .optional(),
  body('phone')
    .isString()
    .isLength({ min: 6, max: 32 })
    .withMessage('Invalid Phone number length.')
    .trim()
    .custom(async (value) => {
      const user = await Admin.findOne({ phone: value });
      if (user) {
        return Promise.reject('Phone Number already exists.');
      }
      return true;
    })
    .escape()
    .optional(),
  body('password').not().exists(),
];

module.exports = updateAdminSchema;
