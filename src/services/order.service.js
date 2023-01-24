const Order = require('../models/order.model');
const Medicine = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');

const orderService = {
  getAllOrders: async (query) => {
    const features = new APIFeatures(Order.find(), query)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const result = await features.query;
    const orders = await result;
    return orders;
  },
  getOrderById: async (orderId) => {
    const order = await Order.findById(orderId);

    return order;
  },
  createOrder: async (data) => {
    // Check if medicine ids are valid
    const medicines = await Promise.all(
      data.orderItems.map(
        async (item) => await Medicine.findById(item.medicine)
      )
    );
    const canOrder = await checkStockStatus(data.orderItems, medicines);
    if (!canOrder) {
      throw ApiError.badRequest();
    }

    try {
      data.orderItems = await Promise.all(
        data.orderItems.map(async (item) => ({
          ...item,
          medicine: await Medicine.findById(item.medicine),
        }))
      );
    } catch (error) {
      throw ApiError.badRequest();
    }
    if (data.orderItems.some((item) => item.medicine.outOfStock)) {
      throw ApiError.badRequest();
    }
    const total = data.orderItems
      .map((item) => item.medicine.price)
      .reduce((a, b) => a + b, 0);

    const newOrder = await Order.create({ ...data, total });
    return newOrder;
  },

  handlingOrdersStatus: async (orderId, statusText) => {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound();

    const orderStatus = order.status;
    if (orderStatus === 'Pending' && statusText !== 'Cancelled') {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: statusText },
        {
          runValidators: true,
          new: true,
        }
      );
      return updatedOrder;
    } else if (orderStatus === 'Accepted' && statusText === 'Delivered') {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: statusText },
        {
          runValidators: true,
          new: true,
        }
      );
      return updatedOrder;
    } else {
      throw new ApiError(
        'You are using wrong end point for cancelling or you cannot cancel on accepted process.',
        400
      );
    }
  },
  cancelOrder: async (orderId, statusText) => {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound();

    const orderStatus = order.status;
    if (orderStatus === 'Pending' && statusText === 'Cancelled') {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: statusText },
        {
          runValidators: true,
          new: true,
        }
      );
      return updatedOrder;
    } else {
      throw new ApiError(
        'You are using wrong end point for cancelling or you cannot cancel on accepted process.',
        400
      );
    }
  },
  getOrdersReport: async (query) => {
    let dateRangeFilter = {};
    if (query.startDate && query.endDate) {
      dateRangeFilter = {
        createdAt: {
          $gte: new Date(query.startDate),
          $lte: new Date(query.endDate),
        },
      };
    }
    const reports = await Order.aggregate([
      {
        $match: dateRangeFilter,
      },
      {
        $unwind: '$orderItems',
      },
      {
        $lookup: {
          from: 'medicines',
          localField: 'orderItems.medicine',
          foreignField: '_id',
          as: 'orderItems.medicine',
        },
      },
      {
        $unwind: '$orderItems.medicine',
      },
      {
        $group: {
          _id: '$orderItems.medicine',
          quantitySold: { $sum: '$orderItems.quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          medicineName: '$_id.name',
          quantitySold: 1,
          category: '$_id.category',
          totalAmount: { $multiply: ['$_id.price', '$quantitySold'] },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category',
          items: {
            $push: {
              name: '$medicineName',
              quantitySold: '$quantitySold',
              totalAmount: '$totalAmount',
            },
          },
          quantitySold: { $sum: '$quantitySold' },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.text',
          items: 1,
          quantitySold: 1,
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: null,
          categories: {
            $push: {
              name: '$category',
              items: '$items',
              quantitySold: '$quantitySold',
              totalAmount: '$totalAmount',
            },
          },
          totalAmount: { $sum: '$totalAmount' },
          quantitySold: { $sum: '$quantitySold' },
        },
      },
      {
        $set: {
          categories: {
            $sortArray: {
              input: '$categories',
              sortBy: { totalAmount: -1 },
            },
          },
        },
      },
    ]);
    return reports;
  },
};

async function checkStockStatus(orderItems, medicines) {
  if (medicines.some((medicine) => medicine.outOfStock)) {
    return false;
  }

  if (
    medicines.some((medicine) => {
      const medicineId = medicine.id;
      const orderItem = orderItems.find((item) => item.medicine === medicineId);
      if (!orderItem || orderItem.quatity > medicine.quantity) {
        return true;
      }
      return false;
    })
  ) {
    return false;
  }

  return true;
}

module.exports = orderService;
