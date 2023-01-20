// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const authRouter = require('./auth.routes');
const medicineRouter = require('./medicineRoutes');

router.use('/examples', exampleRouter);

router.use('/auth', authRouter);

router.use('/medicines', medicineRouter);

module.exports = router;
