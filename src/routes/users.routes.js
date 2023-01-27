const router = require('express').Router();

const validate = require('../middlewares/validate');
const { upload } = require('../lib/multer');
const { USER_TYPES, ADMIN_ROLES } = require('../constants');
const userController = require('../controllers/users.controller');
const authenticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const updateUserSchema = require('../schemas/updateUserSchema');

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
  validate(updateUserSchema),
  authenticate,
  restrictUserTypes(USER_TYPES.customer),
  upload.single('avatar'),
  validate(updateUserSchema),
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
  validate(updateUserSchema),
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  userController.deleteUser
);

module.exports = router;
