const medicineService = require('../services/medicine.service');
const catchAsync = require('../utils/catchAsync');
const apiError = require('../utils/apiError');

exports.getAllMedicines = catchAsync(async (req, res, next) => {
  const medicines = await medicineService.getAllMedicines(req);
  res.status(200).json({
    data: {
      totalCount: medicines.length,
      medicines,
    },
  });
});

exports.getMedicine = catchAsync(async (req, res, next) => {
  const medicine = await medicineService.getMedicine(req.params.id);
  res.status(200).json({
    data: {
      medicine,
    },
  });
});

exports.createMedicine = catchAsync(async (req, res, next) => {
  const newMedicine = await medicineService.createMedicine(req.body);
  res.status(200).json({
    data: {
      newMedicine,
    },
  });
});

exports.updateMedicine = catchAsync(async (req, res, next) => {
  if (req.body.countInstock) {
    throw new apiError(
      'This route is not for updating countInstock quantity',
      400
    );
  }
  const medicine = await medicineService.updateMedicine(
    req.params.id,
    req.body
  );
  res.status(200).json({
    data: {
      medicine,
    },
  });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  const filterObj = (obj, allowed) => {
    const newObj = {};
    newObj[allowed] = obj[allowed];
    return newObj;
  };

  if (req.body.countInstock) {
    const medicine = await medicineService.updateQuantity(
      req.params.id,
      filterObj(req.body, 'countInstock')
    );
    res.status(200).json({
      data: {
        medicine,
      },
    });
  } else {
    return next(
      new apiError('This route is only for updating medicine quantity', 400)
    );
  }
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
  const medicine = await medicineService.deleteMedicine(req.params.id);
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
