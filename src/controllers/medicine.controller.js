const medicineService = require('../services/medicine.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');

exports.getAllMedicines = catchAsync(async (req, res, next) => {
  const medicines = await medicineService.getAllMedicines(req);
  res.json({
    data: {
      code: 200,
      data: medicines,
      count: medicines.length,
    },
  });
});

exports.getMedicine = catchAsync(async (req, res, next) => {
  const medicine = await medicineService.getMedicine(req.params.id);
  res.json({
    data: {
      code: 200,
      data: medicine,
    },
  });
});

exports.createMedicine = catchAsync(async (req, res, next) => {
  console.log('req.body-------->', req.body);
  console.log('req.files-------->', req.files[1].path);

  const newMedicine = await medicineService.createMedicine(req);
  res.json({
    data: {
      code: 200,
      data: newMedicine,
    },
  });
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
  res.json({
    data: {
      code: 200,
      data: medicine,
    },
  });
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
  res.json({
    data: {
      code: 200,
      data: medicine,
    },
  });
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
  await medicineService.deleteMedicine(req.params.id);
  res.json({
    code: 200,
    data: null,
  });
});
