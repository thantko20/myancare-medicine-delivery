const exampleService = require('../services/example.service');
const catchAsync = require('../utils/catchAsync');

exports.getHello = catchAsync(async (req, res, next) => {
  // Now, controller (aka route-handler) has the responsibility
  // of giving necessary information/data to service(s) it uses
  // And response the data returned by those service(s)
  const hello = await exampleService.getHello();
  res.json({
    message: hello,
  });
});
