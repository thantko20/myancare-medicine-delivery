const router = require('express').Router();

const authenticate = require('../middlewares/authenticate');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const adminController = require('../controllers/admin.controller');
const { USER_TYPES, ADMIN_ROLES } = require('../constants');

router.get(
  '/',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins(ADMIN_ROLES.superadmin, ADMIN_ROLES.admin),
  adminController.getAdmins
);

module.exports = router;
