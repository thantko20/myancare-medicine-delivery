// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');

router.use('/examples', exampleRouter);

module.exports = router;
