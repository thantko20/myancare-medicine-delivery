// Put all the routes in here

const router = require('express').Router();

const exampleRouter = require('./exampleRoutes');
const authRouter = require('./auth.routes');

router.use('/examples', exampleRouter);
router.use('/auth', authRouter);

module.exports = router;
