const Order = require('../models/order.model');
const Medicine = require('../models/medicine.model');
const User = require('../models/user.model');
const APIFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');
const { ORDER_STATUS, ORDER_STATUS_LEVEL } = require('../constants');
const {
  sendOrderConfirmationMessageToUser,
  sendOrderShippedMessageToUser,
} = require('../');
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
  createOrder: async (data, user) => {
    // Check if medicine ids are valid
    if (typeof data.shippingAddress !== 'object') {
      data.shippingAddress = user.address;
    }

    data.phone = data.phone || user.phone;
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
      .map((item) => item.medicine.price * item.quantity)
      .reduce((a, b) => a + b, 0);
    const newOrder = await Order.create({ ...data, user: user.id, total });

    return newOrder;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    if (!newStatus || newStatus === ORDER_STATUS.cancelled) {
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
    if (newStatus === ORDER_STATUS.delivering) {
      try {
        console.log('email======>', updatedOrder.user.email);
        await sendOrderShippedMessageToUser(
          updatedOrder.user.email,
          updatedOrder.user.name
        );
      } catch (err) {
        throw new ApiError(
          'There is something went wrong while sending email',
          400
        );
      }
    }
    return updatedOrder;
  },
  cancelOrder: async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound();

    if (order.status !== ORDER_STATUS.pending) {
      throw ApiError.badRequest('Cannot cancel order after confirmation.');
    }

    order.status = ORDER_STATUS.cancelled;
    await order.save();

    await Promise.all(
      order.orderItems.map(async (item) => {
        await Medicine.findByIdAndUpdate(item.medicine, {
          $inc: { quantity: item.quantity },
        });
      })
    );

    return order;
  },
  getOrdersReport: async (query) => {
    let dateRangeFilter = {};

    // TODO: Fix -> throws error when query params are not dates
    if (query.startDate && query.endDate) {
      dateRangeFilter = {
        createdAt: {
          $gte: new Date(query.startDate),
          $lte: new Date(query.endDate),
        },
      };
    }
    const matchStage = {
      $match: {
        ...dateRangeFilter,
        status: ORDER_STATUS.done,
      },
    };

    const unwindAndPopulateOrderItems = [
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
    ];
    const groupByMedicineItemsAndProject = [
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
    ];

    const unwindCategories = [
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
    ];

    const groupByCategoriesAndProject = [
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
    ];

    const projectToTotalAmountWithCategoriesArray = [
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
    ];

    const reports = await Order.aggregate([
      matchStage,
      ...unwindAndPopulateOrderItems,
      ...groupByMedicineItemsAndProject,
      ...unwindCategories,
      ...groupByCategoriesAndProject,
      ...projectToTotalAmountWithCategoriesArray,
    ]);
    return reports[0];
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

async function isValidDate(date) {
  return date && date instanceof Date;
}

module.exports = orderService;
