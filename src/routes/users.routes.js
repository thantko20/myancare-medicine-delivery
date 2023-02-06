const router = require('express').Router();

const validate = require('../middlewares/validate');
const { upload } = require('../lib/multer');
const { USER_TYPES, ADMIN_ROLES } = require('../constants');
const userController = require('../controllers/users.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const updateUserSchema = require('../schemas/updateUserSchema');

router.get(
  '/',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  userController.getAllUsers
);

router.get(
  '/me',
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  userController.getMe
);

router.patch(
  '/me',
  validate(updateUserSchema),
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  upload.single('avatar'),
  validate(updateUserSchema),
  userController.updateMe
);

router.get(
  '/:id',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  userController.getUserById
);

router.patch(
  '/:id',
  validate(updateUserSchema),
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  userController.deleteUser
);

module.exports = router;
