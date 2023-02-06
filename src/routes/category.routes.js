const router = require('express').Router();

const categoryController = require('../controllers/category.controller');
const medicineRoute = require('../routes/medicine.routes');

const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');
const authorize = require('../middlewares/authorize');

router.get('/', categoryController.getAllCategories);

router.post(
  '/',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  categoryController.createCategory
);

router.get(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  categoryController.getCategory
);

router.patch(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  categoryController.deleteCategory
);

router.use('/:categoryId/medicines', medicineRoute);

module.exports = router;
