const router = require('express').Router();

const { USER_TYPES, ADMIN_ROLES } = require('../constants');
const userController = require('../controllers/users.controller');
const authenticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');

router.get(
  '/',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins(),
  userController.getAllUsers
);

router.get(
  '/me',
  authenticate,
  restrictUserTypes(USER_TYPES.customer),
  userController.getMe
);

router.patch(
  '/me',
  authenticate,
  restrictUserTypes(USER_TYPES.customer),
  userController.updateMe
);

router.get(
  '/:id',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins(),
  userController.getUserById
);

router.patch(
  '/:id',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  userController.updateUser
);

module.exports = router;
