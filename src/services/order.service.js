const Order = require('../models/order.model');
const Medicine = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');
const { ORDER_STATUS, ORDER_STATUS_LEVEL } = require('../constants');
const User = require('../models/user.model');

const orderService = {
  getAllOrders: async (query) => {
    const features = new APIFeatures(Order.find(), query)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const orders = await features.query;
    return orders;
  },
  getOrderById: async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
      throw ApiError.badRequest('Order not found.');
    }

    return order;
  },
  getMyOrders: async (userId, query) => {
    if (query.user) query.user = undefined;
    const features = new APIFeatures(Order.find({ user: userId }), query);

    features.filter().paginate().sort();

    const orders = await features.query;

    return orders;
  },
  createOrder: async (data) => {
    // Check if medicine ids are valid
    if (typeof data.shippingAddress !== 'object') {
      const user = await User.findById(data.user).select('address');
      data.shippingAddress = user.address;
    }
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

  updateOrderStatus: async (orderId, newStatus) => {
    if (newStatus === ORDER_STATUS.cancelled) {
      throw ApiError.badRequest('Cannot cancel on this endpoint.');
    }
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.badRequest();

    if (order.status === ORDER_STATUS.cancelled) {
      throw ApiError.badRequest(
        'Cannot update an order that has already been cancelled'
      );
    }

    const orderStatusLevel = ORDER_STATUS_LEVEL[order.status];
    const newOrderStatusLevel = ORDER_STATUS_LEVEL[newStatus];

    if (newOrderStatusLevel - orderStatusLevel !== 1) {
      throw ApiError.badRequest('Status must be updated step-by-step.');
    }

    order.status = newStatus;
    const updatedOrder = await order.save();

    return updatedOrder;
  },
  cancelOrder: async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound();

    if (order.status !== ORDER_STATUS.pending) {
      throw ApiError.badRequest('Cannot cancel order after confirmation.');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: ORDER_STATUS.cancelled,
      },
      { new: true }
    );

    return updatedOrder;
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
  const isOutOfStock = medicines.some((medicine) => medicine.outOfStock);
  if (isOutOfStock) {
    return false;
  }

  const isOrderQuantityOverLimit = medicines.some((medicine) => {
    const medicineId = medicine.id;
    const orderItem = orderItems.find((item) => item.medicine === medicineId);
    return !orderItem || orderItem.quantity > medicine.quantity;
  });

  if (isOrderQuantityOverLimit) {
    return false;
  }

  return true;
}

module.exports = orderService;
