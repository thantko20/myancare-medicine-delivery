const { body } = require('express-validator');

const createOrderSchema = [
  body('orderItems').custom((value) => {
    if (!Array.isArray(value) || value === []) {
      return Promise.reject('Must be an array of ordered items');
    }

    return true;
  }),
  body('orderItems.*.medicine').isMongoId().withMessage('Invalid ID'),
  body('orderItems.*.quantity').isInt().withMessage('Must be a number.'),
  body('shippingAddress.city').isString().escape().optional(),
  body('shippingAddress.zipcode').isString().escape().optional(),
  body('shippingAddress.street').isString().escape().optional(),
  body('shippingAddress.state').isString().escape().optional(),
  body('shippingAddress.country').isString().escape().optional(),
  body('phone')
    .isString()
    .isLength({ min: 6, max: 32 })
    .withMessage(
      'Phone number must have at least 6 characters and 16 characters long.'
    ),
];

module.exports = createOrderSchema;
