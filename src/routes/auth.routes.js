const router = require('express').Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const registerUserSchema = require('../schemas/registerUserSchema');

router.post(
  '/register',
  validate(registerUserSchema),
  authController.registerUser
);

module.exports = router;
