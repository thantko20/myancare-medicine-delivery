const categoryController = require('../controllers/category.controller');
const router = require('express').Router();

router.get('/', categoryController.getAllCategories);

router.post('/', categoryController.createCategory);

router.get('/:id', categoryController.getCategory);

router.patch('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
