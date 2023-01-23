const router = require('express').Router({ mergeParams: true });
const medicineController = require('../controllers/medicine.controller');
const defaultPagination = require('../middlewares/defaultPagination');
const validate = require('../middlewares/validate');
const medicineSchema = require('../schemas/medicineSchema');

router
  .route('/')
  .get(defaultPagination, medicineController.getAllMedicines)
  .post(validate(medicineSchema), medicineController.createMedicine);

router
  .route('/:id')
  .get(medicineController.getMedicine)
  .patch(medicineController.updateMedicine)
  .delete(medicineController.deleteMedicine);

router.route('/:id/updateQuantity').patch(medicineController.updateQuantity);

module.exports = router;
