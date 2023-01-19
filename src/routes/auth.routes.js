const router = require('express').Router();

const authController = require('../controllers/auth.controller');
const autheticate = require('../middlewares/autheticate');
const validate = require('../middlewares/validate');
const loginUserSchema = require('../schemas/loginUserSchema');
const registerUserSchema = require('../schemas/registerUserSchema');

router.post(
  '/register',
  validate(registerUserSchema),
  authController.registerUser
);

router.post('/login', validate(loginUserSchema), authController.loginUser);

router.post('/create-admin', autheticate, authController.createAdmin);

module.exports = router;
