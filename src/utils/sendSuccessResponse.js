const sendSuccessResponse = ({ res, code = 200, data = {} }) => {
  res.status(code).json({
    code,
    data,
    ...(Array.isArray(data) && { count: data.length }),
  });
};

module.exports = sendSuccessResponse;
