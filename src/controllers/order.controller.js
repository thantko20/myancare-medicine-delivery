const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getAllOrders(req.query);
  sendSuccessResponse({ res, code: 200, data: orders });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await orderService.getOrderById(req.params.id);
  sendSuccessResponse({ res, code: 200, data: order });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await orderService.createOrder(req);
  sendSuccessResponse({ res, code: 200, data: newOrder });
});

exports.handlingOrdersStatus = catchAsync(async (req, res, next) => {
  if (!req.body.status) {
    throw new ApiError('This route is only for updating order processing', 400);
  }
  const updatedOrder = await orderService.handlingOrdersStatus(
    req.params.id,
    req.body.status
  );
  sendSuccessResponse({ res, code: 200, data: updatedOrder });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  if (!req.body.status) {
    throw new ApiError('This route is only for order cancelling', 400);
  }
  const updatedOrder = await orderService.cancelOrder(
    req.params.id,
    req.body.status
  );
  sendSuccessResponse({ res, code: 200, data: updatedOrder });
});
