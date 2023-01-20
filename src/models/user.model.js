const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 2, maxLength: 50 },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: 6,
      maxLength: 32,
    },
    customerId: { type: String, unique: true },
    phone: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
      maxLength: 16,
    },
    address: {
      zipcode: { type: String, required: true },
      street: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const hashPassword = async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
};

userSchema.pre('save', hashPassword);
userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const docCount = await this.constructor.count({});
  this.customerId = `C-${(docCount + 1).toString().padStart(4, '0')}`;
  next();
});

const User = model('User', userSchema);

module.exports = User;
