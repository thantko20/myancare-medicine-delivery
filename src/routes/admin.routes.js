const router = require('express').Router();

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const adminController = require('../controllers/admin.controller');
const { USER_TYPES, ADMIN_ROLES } = require('../constants');
const validate = require('../middlewares/validate');
const updateAdminSchema = require('../schemas/updateAdminSchema');
const updateAdminMeSchema = require('../schemas/updateAdminMeSchema');

router.get(
  '/',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  adminController.getAdmins
);

router.get(
  '/me',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  adminController.getMe
);

router.patch(
  '/me',
  validate(updateAdminMeSchema),
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  adminController.updateMe
);

router.get(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  adminController.getAdminById
);

router.patch(
  '/:id',
  validate(updateAdminSchema),
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  adminController.updateAdminById
);

module.exports = router;
