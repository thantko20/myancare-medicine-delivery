const router = require('express').Router();

const { ADMIN_ROLES } = require('../constants');
const authController = require('../controllers/auth.controller');
const autheticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { upload } = require('../lib/multer');
const createAdminSchema = require('../schemas/createAdminSchema');
const loginAdminSchema = require('../schemas/loginAdminSchema');
const loginUserSchema = require('../schemas/loginUserSchema');
const registerUserSchema = require('../schemas/registerUserSchema');

router.post(
  '/register',
  upload.single('avatar'),
  validate(registerUserSchema),
  authController.registerCustomer
);

router.post(
  '/register/admin',
  validate(createAdminSchema),
  autheticate,
  restrictUserTypes('admin'),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  authController.createAdmin
);

router.post('/login', validate(loginUserSchema), authController.loginCustomer);

router.post(
  '/login/admin',
  validate(loginAdminSchema),
  authController.loginAdmin
);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/forget-password', authController.requestResetPassword);

module.exports = router;
