const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getAllOrders(req);
  res.json({
    data: {
      code: 200,
      data: orders,
      count: orders.length,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await orderService.getOrder(req.params.id);
  res.json({
    data: {
      code: 200,
      data: order,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await orderService.createOrder(req);
  res.json({
    data: {
      code: 200,
      data: newOrder,
    },
  });
});

// exports.updateOrder = catchAsync(async (req, res, next) => {
//   const order = await orderService.updateOrder(req.params.id, req.body);
//   res.json({
//     data: {
//       code: 200,
//       data: order,
//     },
//   });
// });

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await orderService.deleteOrder(req.params.id);
  res.json({
    code: 200,
    data: null,
  });
});

exports.handlingOrdersStatus = catchAsync(async (req, res, next) => {
  if (!req.body.status) {
    throw new ApiError('This route is only for updating order processing', 400);
  }
  const updatedOrder = await orderService.handlingOrdersStatus(
    req.params.id,
    req.body.status
  );
  res.json({
    data: {
      code: 200,
      data: updatedOrder,
    },
  });
});
