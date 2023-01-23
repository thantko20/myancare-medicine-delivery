const registerUserSchema = require('./registerUserSchema');

const updateUserSchema = registerUserSchema.map((field) => field.optional());

module.exports = updateUserSchema;
