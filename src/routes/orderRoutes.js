const router = require('express').Router({ mergeParams: true });
const orderController = require('../controllers/order.controller');
const { restrictUserTypes } = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { USER_TYPES } = require('../constants');

router.get('/report', orderController.getOrdersReports);

router.get(
  '/me',
  authenticate,
  restrictUserTypes(USER_TYPES.customer),
  orderController.getMyOrders
);

router
  .route('/')
  .get(authenticate, restrictUserTypes('admin'), orderController.getAllOrders)
  .post(
    authenticate,
    restrictUserTypes('customer'),
    orderController.createOrder
  );

router
  .route('/:id')
  .get(authenticate, restrictUserTypes('both'), orderController.getOrder);

router
  .route('/:id/cancel')
  .patch(authenticate, restrictUserTypes('both'), orderController.cancelOrder);

router.patch(
  '/:id/status',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  orderController.updateOrderStatus
);

module.exports = router;
