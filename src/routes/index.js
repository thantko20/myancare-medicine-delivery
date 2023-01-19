// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const medicineRouter = require('./medicineRoutes');
const categoriesRouter = require('./categoryRoutes');

router.use('/examples', exampleRouter);
router.use('/medicines', medicineRouter);
router.use('/categories', categoriesRouter);

module.exports = router;
