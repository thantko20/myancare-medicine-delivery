const Example = require('../models/example.model');
const validate = require('../utils/validate');
const createExampleSchema = require('../schemas/createExampleSchema');

const exampleService = {
  getHello: async (data) => {
    const result = await validate(createExampleSchema, data);
    return 'Hello World!';
  },
};

module.exports = exampleService;
