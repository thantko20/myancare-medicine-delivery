const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const { ADMIN_ROLE_LIST } = require('../constants');

const adminSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 50 },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 6,
    maxLength: 16,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minLength: 6,
    maxLength: 32,
  },
  role: { type: String, enum: ADMIN_ROLE_LIST, required: true },
});

const hashPassword = async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
};

adminSchema.pre('save', hashPassword);

const Admin = model('Admin', adminSchema);

module.exports = Admin;
