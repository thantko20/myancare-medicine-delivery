const router = require('express').Router({ mergeParams: true });
const orderController = require('../controllers/order.controller');
const defaultPagination = require('../middlewares/defaultPagination');
const validate = require('../middlewares/validate');
const orderSchema = require('../schemas/orderSchema');

// const autheticate = require('../middlewares/authenticate');
// const { ADMIN_ROLES } = require('../constants');

router
  .route('/')
  .get(defaultPagination, orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  // .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.route('/:id').patch(orderController.handlingOrdersStatus);

router
  .route('/:userId/orderHistory')
  .get(defaultPagination, orderController.getAllOrders);

module.exports = router;
