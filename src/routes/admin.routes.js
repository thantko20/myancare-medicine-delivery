const router = require('express').Router();

const authenticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const adminController = require('../controllers/admin.controller');
const { USER_TYPES, ADMIN_ROLES } = require('../constants');
const validate = require('../middlewares/validate');
const updateAdminSchema = require('../schemas/updateAdminSchema');
const updateAdminMeSchema = require('../schemas/updateAdminMeSchema');

router.get(
  '/',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  adminController.getAdmins
);

router.get(
  '/me',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  adminController.getMe
);

router.patch(
  '/me',
  validate(updateAdminMeSchema),
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  adminController.updateMe
);

router.get(
  '/:id',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  adminController.getAdminById
);

router.patch(
  '/:id',
  validate(updateAdminSchema),
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  adminController.updateAdminById
);

module.exports = router;
