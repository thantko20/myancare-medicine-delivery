const router = require('express').Router({ mergeParams: true });

const medicineController = require('../controllers/medicine.controller');
const validate = require('../middlewares/validate');
const medicineSchema = require('../schemas/medicineSchema');
const { upload } = require('../lib/multer');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');

router.get('/', medicineController.getAllMedicines);

router.post(
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  upload.array('images', 2),
  validate(medicineSchema),
  medicineController.createMedicine
);

router.get('/:id', medicineController.getMedicine);

router.patch(
  '/:id',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  restrictAdmins([
    ADMIN_ROLES.superadmin,
    ADMIN_ROLES.admin,
    ADMIN_ROLES.supervisor,
  ]),
  upload.array('images', 2),
  medicineController.updateMedicine
);

router.delete(
  '/:id',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  medicineController.deleteMedicine
);

router
  .route('/:id/updateQuantity')
  .patch(
    authenticate,
    restrictUserTypes('admin'),
    restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
    medicineController.updateQuantity
  );

router.patch(
  '/:id/update-quantity',
  authenticate,
  restrictUserTypes('admin'),
  restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
  medicineController.updateQuantity
);

module.exports = router;
