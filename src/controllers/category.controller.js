const categoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await categoryService.getAllCategories(req.query);
  sendSuccessResponse({ res, code: 200, data: categories });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.getCategory(req.params.id);
  sendSuccessResponse({ res, code: 200, data: category });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await categoryService.createCategory(req.body);
  sendSuccessResponse({ res, code: 200, data: newCategory });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  sendSuccessResponse({ res, code: 200, data: category });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccessResponse({ res, code: 200, data: null });
});
