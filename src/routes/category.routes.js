const categoryController = require('../controllers/category.controller');
const medicineRoute = require('../routes/medicine.routes');
const router = require('express').Router();

router.get('/', categoryController.getAllCategories);

router.post('/', categoryController.createCategory);

router.get('/:id', categoryController.getCategory);

router.patch('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

router.use('/:categoryId/medicines', medicineRoute);

module.exports = router;
