// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const productRouter = require('./medicineRoutes');

router.use('/examples', exampleRouter);
router.use('/products', productRouter);

module.exports = router;
