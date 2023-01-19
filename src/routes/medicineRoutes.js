const router = require('express').Router();
const medicineController = require('../controllers/medicine.controller');
const { PAGE_LIMIT, DEFAULT_SORTING } = require('../constants');
require('dotenv').config();

const firstAllProducts = (req, res, next) => {
  req.query.limit = PAGE_LIMIT;
  req.query.sort = DEFAULT_SORTING;
  next();
};

router
  .route('/')
  .get(firstAllProducts, medicineController.getAllProducts)
  .post(medicineController.createProduct);

router
  .route('/:id')
  .get(medicineController.getProduct)
  .patch(medicineController.updateProduct)
  .delete(medicineController.deleteProduct);

router.route('/:id/updateQuantity').patch(medicineController.updateQuantity);

module.exports = router;
