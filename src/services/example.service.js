const Example = require('../models/example.model');

const exampleService = {
  getHello: async () => {
    // const hello = await Example.findOne();
    return 'Hello World!';
  },
};

module.exports = exampleService;
