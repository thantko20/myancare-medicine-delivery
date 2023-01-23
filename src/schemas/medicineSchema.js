const { body } = require('express-validator');
const Medicine = require('../models/medicine.model');

const medicineSchema = [
  body('name')
    .isString()
    .notEmpty()
    .exists()
    .isLength({ min: 5 })
    .withMessage(
      'Name must be string with minimum length of 5 and must be unique.'
    )
    .trim()
    .custom(async (value) => {
      const medicine = await Medicine.findOne({ name: value });
      if (medicine) {
        return Promise.reject('This kind of medicine name already exists.');
      }
      return true;
    }),
  body('price').isNumeric().withMessage('Price must be a number.'),
  body('category').isMongoId().withMessage('Category must be mongo id.'),
  body('images').isString().withMessage('All images must be string url.'),

  body('description')
    .isString()
    .isLength({ min: 10 })
    .withMessage('Description must be string and minimum length of 10.'),
  body('quantity')
    .isNumeric()
    .withMessage('Instock items quantity must be number.'),
  body('expiredDate')
    .isString()
    .withMessage('Expired Date must be a date format string. ')
    .customSanitizer(async (value) => {
      return new Date(value).toISOString();
    }),
];

module.exports = medicineSchema;
