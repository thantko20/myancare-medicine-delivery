const router = require('express').Router();

const userController = require('../controllers/users.controller');
const authenticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');

router.get(
  '/',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins(),
  userController.getAllUsers
);

module.exports = router;
