const medicineService = require('../services/medicine.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const sendSuccessResponse = require('../utils/sendSucessResponse');

exports.getAllMedicines = catchAsync(async (req, res, next) => {
  const medicines = await medicineService.getAllMedicines(req);
  sendSuccessResponse({ res, code: 200, data: medicines });
});

exports.getMedicine = catchAsync(async (req, res, next) => {
  const medicine = await medicineService.getMedicine(req.params.id);
  sendSuccessResponse({ res, code: 200, data: medicine });
});

exports.createMedicine = catchAsync(async (req, res, next) => {
  const newMedicine = await medicineService.createMedicine(req);
  sendSuccessResponse({ res, code: 200, data: newMedicine });
});

exports.updateMedicine = catchAsync(async (req, res, next) => {
  if (req.body.quantity) {
    throw new ApiError(
      'This route is not for updating medicine quantities.',
      400
    );
  }
  const medicine = await medicineService.updateMedicine(
    req.params.id,
    req.body
  );
  sendSuccessResponse({ res, code: 200, data: medicine });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  if (!req.body.quantity) {
    throw new ApiError(
      'This route is only for medicine quantities update.',
      400
    );
  }
  const medicine = await medicineService.updateQuantity(req.params.id, {
    quantity: req.body.quantity,
  });
  sendSuccessResponse({ res, code: 200, data: medicine });
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
  await medicineService.deleteMedicine(req.params.id);
  sendSuccessResponse({ res, code: 200, data: null });
});
