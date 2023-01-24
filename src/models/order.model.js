const { Schema, model, default: mongoose, mongo } = require('mongoose');

const orderSchema = new Schema({
  orderItems: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate('user', '-password -__v');
  this.populate({
    path: 'orderItems',
    populate: {
      path: 'medicine',
      model: 'Medicine',
    },
  });
  next();
});

const Order = model('Order', orderSchema);

module.exports = Order;
