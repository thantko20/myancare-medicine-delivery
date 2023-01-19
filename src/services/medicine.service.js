const Medicine = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');

const medicineService = {
  getAllMedicines: async (reqQuery) => {
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
    const features = new APIFeatures(Medicine.find(), reqQuery)
      .filter(customFilter)
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
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
