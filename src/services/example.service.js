const Example = require('../models/example.model');

const exampleService = {
  getHello: async (data) => {
    return 'Hello World!';
  },
};

module.exports = exampleService;
