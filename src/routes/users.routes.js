const router = require('express').Router();

const { USER_TYPES } = require('../constants');
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

module.exports = router;
