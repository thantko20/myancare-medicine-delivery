const Order = require('../models/order.model');
const Medicine = require('../models/medicine.model');
const APIFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');

const orderService = {
  getAllOrders: async (req) => {
    // Filtering OrderStatus
    let customFilter = {};
    if (req.query.status)
      customFilter = {
        status: req.query.status,
      };

    // filtering user's order history only
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Order.find(filter), req.query)
      .filter(customFilter)
      .limitFields()
      .paginate()
      .sort();
    const result = await features.query;
    const orders = await result;
    return orders;
  },
  getOrder: async (orderId) => {
    const order = await Order.findById(orderId)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'medicine',
          select: 'name price category description',
        },
      });

    return order;
  },
  createOrder: async (req) => {
    const totalPrices = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        const orderItemId = orderItem.medicine;
        const orderedMedicineItem = await Medicine.findById(orderItemId);
        const totalPrice = orderedMedicineItem.price * orderItem.quantity;
        return totalPrice;
      })
    );
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const newOrder = await Order.create({ total: totalPrice, ...req.body });
    return newOrder;
  },

  handlingOrdersStatus: async (orderId, statusText) => {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound();

    const orderStatus = order.status;
    if (orderStatus === 'Pending') {
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
      throw new ApiError('You cannot cancel on accepted process.', 400);
    }
  },
};

module.exports = orderService;
