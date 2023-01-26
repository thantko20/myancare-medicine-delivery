const router = require('express').Router({ mergeParams: true });
const medicineController = require('../controllers/medicine.controller');
const defaultPagination = require('../middlewares/defaultPagination');
const validate = require('../middlewares/validate');
const medicineSchema = require('../schemas/medicineSchema');
const { uploadMedicineImages, toStoreAsStr, upload } = require('../lib/multer');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES, USER_TYPES } = require('../constants');

router
  .route('/')
  .get(defaultPagination, medicineController.getAllMedicines)
  .post(
    authenticate,
    restrictUserTypes('admin'),
    restrictAdmins([ADMIN_ROLES.superadmin, ADMIN_ROLES.admin]),
    upload.array('images', 2),
    validate(medicineSchema),
    medicineController.createMedicine
  );

router
  .route('/:id')
  .get(medicineController.getMedicine)
  .patch(
    authenticate,
    restrictUserTypes(USER_TYPES.admin),
    restrictAdmins([
      ADMIN_ROLES.superadmin,
      ADMIN_ROLES.admin,
      ADMIN_ROLES.supervisor,
    ]),
    upload.array('images', 2),
    medicineController.updateMedicine
  )
  .delete(
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

module.exports = router;
