const { body } = require('express-validator');

const User = require('../models/user.model');

const updateUserSchema = [
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
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('Email already exists.');
      }
      return true;
    })
    .optional(),
  body('phone')
    .isString()
    .isLength({ min: 6, max: 16 })
    .withMessage('Invalid Phone number length.')
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        return Promise.reject('Phone Number already exists.');
      }
      return true;
    })
    .escape()
    .optional(),
  body('address.zipcode').isString().escape().optional(),
  body('address.street').isString().escape().optional(),
  body('address.state').isString().escape().optional(),
  body('address.city').isString().escape().optional(),
  body('address.country').isString().escape().optional(),
];

module.exports = updateUserSchema;
