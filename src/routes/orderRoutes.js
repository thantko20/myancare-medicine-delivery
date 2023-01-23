const router = require('express').Router({ mergeParams: true });
const orderController = require('../controllers/order.controller');
const defaultPagination = require('../middlewares/defaultPagination');
const validate = require('../middlewares/validate');
const orderSchema = require('../schemas/orderSchema');
const { restrictUserTypes } = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');

router
  .route('/')
  .get(
    authenticate,
    restrictUserTypes('admin'),
    defaultPagination,
    orderController.getAllOrders
  )
  .post(
    authenticate,
    restrictUserTypes('customer'),
    orderController.createOrder
  );

router
  .route('/:id')
  .get(authenticate, restrictUserTypes('admin'), orderController.getOrder);

// Order Status Changing / accept/delivered
router
  .route('/:id')
  .patch(
    authenticate,
    restrictUserTypes('admin'),
    orderController.handlingOrdersStatus
  );

router
  .route('/:id/cancel')
  .patch(authenticate, restrictUserTypes('both'), orderController.cancelOrder);

// user's order-history after he ordered
router
  .route('/:userId/orderHistory')
  .get(
    authenticate,
    restrictUserTypes('both'),
    defaultPagination,
    orderController.getAllOrders
  );

module.exports = router;
