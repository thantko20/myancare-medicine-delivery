const categoryController = require('../controllers/category.controller');
const medicineRoute = require('../routes/medicine.routes');
const router = require('express').Router();

const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');

router.get('/', categoryController.getAllCategories);

router.post(
  '/',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins(ADMIN_ROLES.admin, ADMIN_ROLES.superadmin),
  categoryController.createCategory
);

router.get(
  '/:id',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins(ADMIN_ROLES.admin, ADMIN_ROLES.superadmin),
  categoryController.getCategory
);

router.patch(
  '/:id',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins(ADMIN_ROLES.admin, ADMIN_ROLES.superadmin),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins(ADMIN_ROLES.admin, ADMIN_ROLES.superadmin),
  categoryController.deleteCategory
);

router.use('/:categoryId/medicines', medicineRoute);

module.exports = router;
