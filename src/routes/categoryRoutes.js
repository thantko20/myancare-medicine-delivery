const categoryController = require('../controllers/category.controller');
const router = require('express').Router();
const medicineRouter = require('../routes/medicineRoutes');

//Pls ignore this line for a moment
// router.use('/:categoryId/medicines', medicineRouter);

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
