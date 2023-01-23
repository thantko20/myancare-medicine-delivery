const router = require('express').Router({ mergeParams: true });
const orderController = require('../controllers/order.controller');
const defaultPagination = require('../middlewares/defaultPagination');
const validate = require('../middlewares/validate');
const orderSchema = require('../schemas/orderSchema');
const {
  restrictUserTypes,
  restrictAdmins,
} = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { ADMIN_ROLES } = require('../constants');
// const autheticate = require('../middlewares/authenticate');
// const { ADMIN_ROLES } = require('../constants');

router
  .route('/')
  .get(
    // authenticate,
    // restrictUserTypes('admin'),
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

// Order Status Changing / accept/cancelled/delivered
router.route('/:id').patch(orderController.handlingOrdersStatus);

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
