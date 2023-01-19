const categoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await categoryService.getAllCategories(req.query);
  res.status(200).json({
    data: {
      totalCount: categories.length,
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.getCategory(req.params.id);
  res.status(200).json({
    data: {
      category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(200).json({
    data: {
      newCategory,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  res.status(200).json({
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
