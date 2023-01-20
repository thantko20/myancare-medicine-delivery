// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const authRouter = require('./auth.routes');
const medicineRouter = require('./medicineRoutes');
const categoriesRouter = require('./categoryRoutes');
const userRouter = require('./users.routes');

router.use('/examples', exampleRouter);

router.use('/auth', authRouter);

router.use('/medicines', medicineRouter);
router.use('/categories', categoriesRouter);

router.use('/users', userRouter);

module.exports = router;
