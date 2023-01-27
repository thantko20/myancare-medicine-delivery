const Medicine = require('../models/medicine.model');
const ApiError = require('../utils/apiError');

const medicineService = {
  getAllMedicines: async (req) => {
    let customFilter = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category_details',
        },
      },
      {
        $unwind: '$category_details',
      },
      // searching medicines on category and name
      {
        $match: {
          $or: [
            {
              name: {
                $regex: req.query.search || '',
                $options: 'i',
              },
            },
            {
              'category_details.text': {
                $regex: req.query.search || '',
                $options: 'i',
              },
            },
          ],
        },
      },
    ];

    // searching medicines with category
    if (req.query.category) {
      customFilter.push({
        $match: {
          'category_details.text': req.query.category,
        },
      });
    }

    // cheking outofstock items
    const quantityFilter = {
      ...(req.query.outOfStock === 'true' ? { $lte: 0 } : { $gt: 0 }),
    };
    if (req.query.outOfStock) {
      customFilter.push({
        $match: {
          quantity: quantityFilter,
        },
      });
    }

    // sorting
    if (req.query.sort_by && req.query.sort_order) {
      let sort = {};
      sort[req.query.sort_by] = req.query.sort_order === 'ascending' ? 1 : -1;
      customFilter.push({
        $sort: sort,
      });
    } else {
      customFilter.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    customFilter.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    );

    // Expired Filter
    if (req.query.startDate && req.query.endDate) {
      customFilter.push({
        $match: {
          expiredDate: {
            $gte: new Date(req.query.startDate).toISOString(),
            $lte: new Date(req.query.endDate).toISOString(),
          },
        },
      });
    }

    // console.log('customFilter', customFilter);
    // customFilter = {name: {$regex......}, category: {$regex...}}

    /////////////pls ignore this two lines for a moment/////////
    // let filter = {};
    // if (req.params.categoryId) filter = { category: req.params.categoryId };
    ///////////////////////////////////////////////////////////////

    const result = await Medicine.aggregate(customFilter);
    const medicine = result.map(
      ({ quantity, updatedAt, category, __v, ...rest }) => {
        return {
          ...rest,
          outOfStock: quantity <= 0,
        };
      }
    );

    return medicine;
  },
  getMedicine: async (medicineId) => {
    const medicine = await Medicine.findById(medicineId);
    return medicine;
  },
  createMedicine: async (data, images) => {
    const imagesWithUrls = images.map((img) => ({
      filename: img.filename,
      url: img.path,
    }));
    const newMedicine = await Medicine.create({
      ...data,
      images: imagesWithUrls,
    });
    return newMedicine;
  },
  updateMedicine: async (medicineId, data, files = []) => {
    const sanitizedFiles = files.map((file) => ({
      filename: file.filename,
      url: file.path,
    }));

    const { deletedImagesIds = [], ...updatedData } = data;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) throw ApiError.badRequest('No medicine found.');

    const updatedImages = [
      ...medicine.images.filter(
        (img) => !deletedImagesIds.some((id) => id === img.filename)
      ),
      ...sanitizedFiles,
    ];

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicine.id,
      { ...updatedData, images: updatedImages },
      { new: true }
    );

    return updatedMedicine;
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
