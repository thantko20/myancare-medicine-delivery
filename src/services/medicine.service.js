const Medicine = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');

const medicineService = {
  getAllMedicines: async (req) => {
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
      //===================
      // ...(req.query.name && {
      //   name: {
      //     $regex: req.query.name,
      //     $options: 'i',
      //   },
      // }),
      // ...(req.query.category && {
      //   category: {
      //     $regex: req.query.category,
      //     $options: 'i',
      //   },
      // }),

      ...(req.query.isInstock && {
        isInstock: req.query.isInstock,
      }),
    };

    let filter = {};
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    const features = new APIFeatures(Medicine.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const result = await features.query;
    const medicine = await result;
    return medicine;
  },
  getMedicine: async (medicineId) => {
    const medicine = await Medicine.findById(medicineId);
    return medicine;
  },
  createMedicine: async (reqBody) => {
    const newMedicine = await Medicine.create(reqBody);
    newMedicine.save({
      validateBeforeSave: false,
    });
    return newMedicine;
  },
  updateMedicine: async (medicineId, reqBody) => {
    const updatedmedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      reqBody,
      {
        runValidators: true,
        new: true,
      }
    );
    return updatedmedicine;
  },
  updateQuantity: async (medicineId, reqBody) => {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      reqBody,
      {
        runValidators: true,
        new: true,
      }
    );
    return updatedMedicine;
  },
  deleteMedicine: async (medicineId) => {
    const deletedMedicine = await Medicine.findByIdAndDelete(medicineId);
  },
};

module.exports = medicineService;
