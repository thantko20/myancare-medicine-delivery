const ApiError = require('./apiError');

module.exports = async (schema, data) => {
  try {
    const result = await schema.validateAsync(data);
    return result;
  } catch (error) {
    throw ApiError.badRequest('Validation Error');
  }
};
