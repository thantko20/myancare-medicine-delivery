const router = require('express').Router({ mergeParams: true });

const medicineController = require('../controllers/medicine.controller');
const validate = require('../middlewares/validate');
const medicineSchema = require('../schemas/medicineSchema');
const { upload } = require('../lib/multer');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');

router.get('/', medicineController.getAllMedicines);

router.post(
  '/',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  upload.array('images', 2),
  validate(medicineSchema),
  medicineController.createMedicine
);

router.get('/:id', medicineController.getMedicine);

router.patch(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [
      ADMIN_ROLES.superadmin,
      ADMIN_ROLES.admin,
      ADMIN_ROLES.operator,
    ],
  }),
  upload.array('images', 2),
  medicineController.updateMedicine
);

router.delete(
  '/:id',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [ADMIN_ROLES.superadmin, ADMIN_ROLES.admin],
  }),
  medicineController.deleteMedicine
);

router.patch(
  '/:id/update-quantity',
  authenticate,
  authorize({
    type: USER_TYPES.admin,
    adminRoles: [
      ADMIN_ROLES.superadmin,
      ADMIN_ROLES.admin,
      ADMIN_ROLES.supervisor,
    ],
  }),
  medicineController.updateQuantity
);

router.post(
  '/saved/:medicineId',
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  medicineController.addToSaved
);

router.delete(
  '/saved/:medicineId',
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  medicineController.removeFromSaved
);

module.exports = router;
