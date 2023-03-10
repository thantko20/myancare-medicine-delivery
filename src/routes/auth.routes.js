const router = require('express').Router();

const { ADMIN_ROLES, USER_TYPES } = require('../constants');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { upload } = require('../lib/multer');
const createAdminSchema = require('../schemas/createAdminSchema');
const loginAdminSchema = require('../schemas/loginAdminSchema');
const loginUserSchema = require('../schemas/loginUserSchema');
const registerUserSchema = require('../schemas/registerUserSchema');
const updateUserPasswordSchema = require('../schemas/updateUserPasswordSchema');

router.post(
  '/register',
  upload.single('avatar'),
  validate(registerUserSchema),
  authController.registerCustomer
);

router.post(
  '/register/admin',
  validate(createAdminSchema),
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  authController.createAdmin
);

router.post('/register/superadmin', authController.createSuperAdmin);

router.post('/login', validate(loginUserSchema), authController.loginCustomer);

router.post(
  '/login/admin',
  validate(loginAdminSchema),
  authController.loginAdmin
);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/forget-password', authController.requestResetPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.post(
  '/reset-password/admin',
  authenticate,
  authorize({ type: USER_TYPES.admin, adminRoles: [ADMIN_ROLES.superadmin] }),
  authController.overrideAdminPassword
);

router.post(
  '/update-password',
  validate(updateUserPasswordSchema),
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  authController.updatePassword
);

router.post(
  '/update-password/admin',
  validate(updateUserPasswordSchema),
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  authController.updateAdminPassword
);

module.exports = router;
