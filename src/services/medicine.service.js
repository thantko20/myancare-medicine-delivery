const Product = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');

const medicineService = {
  getAllProducts: async (reqQuery) => {
    const customFilter = {
      // $or: [
      //   {
      //     name: {
      //       $regex: reqQuery.name,
      //       $options: 'i',
      //     },
      //   },
      //   {
      //     category: {
      //       $regex: reqQuery.category,
      //       $options: 'i',
      //     },
      //   },
      // ],
      ...(reqQuery.name && {
        name: {
          $regex: reqQuery.name,
          $options: 'i',
        },
      }),
      ...(reqQuery.category && {
        category: {
          $regex: reqQuery.category,
          $options: 'i',
        },
      }),
    };
    const features = new APIFeatures(Product.find(), reqQuery)
      .filter(customFilter)
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const result = await features.query;
    const products = await result;
    return products;
  },
  getProduct: async (productId) => {
    const product = await Product.findById(productId);
    return product;
  },
  createProduct: async (reqBody) => {
    const newProduct = await Product.create(reqBody);
    return newProduct;
  },
  updateProduct: async (productId, reqBody) => {
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqBody, {
      runValidators: true,
      new: true,
    });
    return updatedProduct;
  },
  updateQuantity: async (productId, reqBody) => {
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqBody, {
      runValidators: true,
      new: true,
    });
    return updatedProduct;
  },
  deleteProduct: async (productId) => {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  },
};

module.exports = medicineService;
