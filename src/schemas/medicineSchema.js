const { body } = require('express-validator');

const medicineSchema = [
  body('name')
    .isString()
    .exists()
    .withMessage('Name must be a string')
    .isLength({ min: 5 })
    .withMessage('Name must have minmum length of 5')
    .trim(),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('image').isString().withMessage('Image must be a string'),
  body('category').isMongoId().withMessage('Category must be mongo id'),
  body('description')
    .isString()
    .isLength({ min: 10 })
    .withMessage('Description must be string'),
  body('countInstock')
    .isNumeric()
    .withMessage('Instock items quantity must be number'),
  body('expiredDate').isDate().withMessage('Expired Date must be a date'),
];

module.exports = medicineSchema;
