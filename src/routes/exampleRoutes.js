const router = require('express').Router();
const exampleController = require('../controllers/example.controller');

router.get('/', exampleController.getHello);

module.exports = router;
