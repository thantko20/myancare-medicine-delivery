const router = require('express').Router();

const orderController = require('../controllers/order.controller');
const { restrictUserTypes } = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { USER_TYPES } = require('../constants');
const createOrderSchema = require('../schemas/createOrderSchema');

router.get(
  '/',
  authenticate,
  restrictUserTypes('admin'),
  orderController.getAllOrders
);

router.post(
  '/',
  validate(createOrderSchema),
  authenticate,
  restrictUserTypes('customer'),
  orderController.createOrder
);

router.get(
  '/report',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  orderController.getOrdersReports
);

router.get(
  '/me',
  authenticate,
  restrictUserTypes(USER_TYPES.customer),
  orderController.getMyOrders
);

router.get(
  '/:id',
  authenticate,
  restrictUserTypes('both'),
  orderController.getOrder
);

router.patch(
  '/:id/cancel',
  authenticate,
  restrictUserTypes('both'),
  orderController.cancelOrder
);

router.patch(
  '/:id/status',
  authenticate,
  restrictUserTypes(USER_TYPES.admin),
  orderController.updateOrderStatus
);

module.exports = router;
