// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const authRouter = require('./auth.routes');
const medicineRouter = require('./medicine.routes');
const categoriesRouter = require('./category.routes');
const ordersRouter = require('./order.routes');
const userRouter = require('./users.routes');

router.use('/examples', exampleRouter);

router.use('/auth', authRouter);

router.use('/medicines', medicineRouter);
router.use('/categories', categoriesRouter);
router.use('/orders', ordersRouter);

router.use('/users', userRouter);

module.exports = router;
