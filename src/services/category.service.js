const Category = require('../models/category.model');

const categoryService = {
  getAllCategories: async () => {
    const category = await Category.find();
    return category;
  },
  getCategory: async (categoryId) => {
    const category = await Category.findById(categoryId);
    return category;
  },
  createCategory: async (reqBody) => {
    const newCategory = await Category.create(reqBody);
    newCategory.save({
      validateBeforeSave: false,
    });
    return newCategory;
  },
  updateCategory: async (categoryId, reqBody) => {
    const updatedcategory = await Category.findByIdAndUpdate(
      categoryId,
      reqBody,
      {
        runValidators: true,
        new: true,
      }
    );
    return updatedcategory;
  },
  deleteCategory: async (categoryId) => {
    await Category.findByIdAndDelete(categoryId);
  },
};

module.exports = categoryService;
