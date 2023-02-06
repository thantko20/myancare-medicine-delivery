const router = require('express').Router();

const orderController = require('../controllers/order.controller');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { USER_TYPES } = require('../constants');
const createOrderSchema = require('../schemas/createOrderSchema');

router.get(
  '/',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  orderController.getAllOrders
);

router.post(
  '/',
  validate(createOrderSchema),
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  orderController.createOrder
);

router.get(
  '/report',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  orderController.getOrdersReports
);

router.get(
  '/me',
  authenticate,
  authorize({ type: USER_TYPES.customer }),
  orderController.getMyOrders
);

router.get(
  '/:id',
  authenticate,
  authorize({ type: 'both' }),
  orderController.getOrder
);

router.patch(
  '/:id/cancel',
  authenticate,
  authorize({ type: 'both' }),
  orderController.cancelOrder
);

router.patch(
  '/:id/status',
  authenticate,
  authorize({ type: USER_TYPES.admin }),
  orderController.updateOrderStatus
);

module.exports = router;
