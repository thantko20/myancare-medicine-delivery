const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
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
  const newOrder = await orderService.createOrder(req.body, req.user);
  sendSuccessResponse({ res, code: 200, data: newOrder });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const updatedOrder = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );
  sendSuccessResponse({ res, data: updatedOrder });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getMyOrders(req.user.id, req.query);

  sendSuccessResponse({ res, data: orders });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await orderService.cancelOrder(req.params.id);
  sendSuccessResponse({ res, data: updatedOrder });
});

exports.getOrdersReports = catchAsync(async (req, res, next) => {
  const reports = await orderService.getOrdersReport(req.query);

  sendSuccessResponse({ res, data: reports });
});
