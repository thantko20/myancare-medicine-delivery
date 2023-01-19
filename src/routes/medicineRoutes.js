const router = require('express').Router({ mergeParams: true });
const medicineController = require('../controllers/medicine.controller');
const { PAGE_LIMIT, DEFAULT_SORTING } = require('../constants');
require('dotenv').config();

const firstAllMedicines = (req, res, next) => {
  req.query.limit = PAGE_LIMIT;
  req.query.sort = DEFAULT_SORTING;
  next();
};

router
  .route('/')
  .get(firstAllMedicines, medicineController.getAllMedicines)
  .post(medicineController.createMedicine);

router
  .route('/:id')
  .get(medicineController.getMedicine)
  .patch(medicineController.updateMedicine)
  .delete(medicineController.deleteMedicine);

router.route('/:id/updateQuantity').patch(medicineController.updateQuantity);

module.exports = router;
