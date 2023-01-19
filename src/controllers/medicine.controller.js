const medicineService = require('../services/medicine.service');
const catchAsync = require('../utils/catchAsync');
const apiError = require('../utils/apiError');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await medicineService.getAllProducts(req.query);
  res.status(200).json({
    data: {
      totalCount: products.length,
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await medicineService.getProduct(req.params.id);
  res.status(200).json({
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await medicineService.createProduct(req.body);
  res.status(200).json({
    data: {
      newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.body.countInstock) {
    throw new apiError(
      'This route is not for updating countInstock quantity',
      400
    );
  }
  const product = await medicineService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    data: {
      product,
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
    const product = await medicineService.updateQuantity(
      req.params.id,
      filterObj(req.body, 'countInstock')
    );
    res.status(200).json({
      data: {
        product,
      },
    });
  } else {
    return next(
      new apiError('This route is only for updating medicine quantity', 400)
    );
  }
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await medicineService.deleteProduct(req.params.id);
  res.status(200).json({
    data: {
      product,
    },
  });
});
