const categoryController = require('../controllers/category.controller');
const router = require('express').Router();
const medicineRouter = require('../');

router.use('/:categoryId/medicines');

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;