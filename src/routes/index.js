// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const medicineRouter = require('./medicineRoutes');

router.use('/examples', exampleRouter);
router.use('/medicines', medicineRouter);

module.exports = router;
