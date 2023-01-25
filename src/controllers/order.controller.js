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
  const newOrder = await orderService.createOrder(req.body);
  sendSuccessResponse({ res, code: 200, data: newOrder });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  if (!req.body.status) {
    throw new ApiError('This route is only for updating order processing', 400);
  }
  const updatedOrder = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  sendSuccessResponse({ res, data: updatedOrder });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await orderService.cancelOrder(req.params.id);
  sendSuccessResponse({ res, data: updatedOrder });
});

exports.getOrdersReports = catchAsync(async (req, res, next) => {
  const reports = await orderService.getOrdersReport(req.query);

  res.json({
    data: reports,
  });
});
