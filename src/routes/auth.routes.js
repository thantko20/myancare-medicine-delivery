const router = require('express').Router();

const { ADMIN_ROLES } = require('../constants');
const authController = require('../controllers/auth.controller');
const autheticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const createAdminSchema = require('../schemas/createAdminSchema');
const loginUserSchema = require('../schemas/loginUserSchema');
const registerUserSchema = require('../schemas/registerUserSchema');

router.post(
  '/register',
  validate(registerUserSchema),
  authController.registerCustomer
);

router.post('/login', validate(loginUserSchema), authController.loginCustomer);

router.post('/login/admin', authController.loginAdmin);

router.post('/refresh-token', authController.refreshAccessToken);

router.post(
  '/create-admin',
  validate(createAdminSchema),
  autheticate,
  restrictUserTypes('admin'),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  authController.createAdmin
);

module.exports = router;
