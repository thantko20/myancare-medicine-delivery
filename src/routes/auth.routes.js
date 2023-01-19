const router = require('express').Router();

const authController = require('../controllers/auth.controller');
const autheticate = require('../middlewares/autheticate');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const createAdminSchema = require('../schemas/createAdminSchema');
const loginUserSchema = require('../schemas/loginUserSchema');
const registerUserSchema = require('../schemas/registerUserSchema');

router.post(
  '/register',
  validate(registerUserSchema),
  authController.registerUser
);

router.post('/login', validate(loginUserSchema), authController.loginUser);

router.post('/login/admin', authController.loginAdmin);

router.post('/refresh-token', authController.refreshAccessToken);

router.post(
  '/create-admin',
  validate(createAdminSchema),
  autheticate,
  restrictTo(false, ['ADMIN', 'SUPERADMIN']),
  authController.createAdmin
);

module.exports = router;
