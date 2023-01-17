const router = require('express').Router();
const exampleController = require('../controllers/example.controller');
const validate = require('../middlewares/validate');
const createExampleSchema = require('../schemas/createExampleSchema');

router.get('/', validate(createExampleSchema), exampleController.getHello);

module.exports = router;
