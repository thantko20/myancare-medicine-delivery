const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    customerId: { type: String, unique: true },
    phone: { type: String, unique: true, required: true },
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

const userModel = model('User', userSchema);

module.exports = userModel;
