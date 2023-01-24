const { Schema, model, default: mongoose } = require('mongoose');

const { ORDER_STATUS, ORDER_STATUS_LIST } = require('../constants');

const orderSchema = new Schema(
  {
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
      enum: ORDER_STATUS_LIST,
      default: ORDER_STATUS.pending,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

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

orderSchema.pre('save', async function () {
  const Medicine = this.constructor.model('Medicine');
  await Promise.all(
    this.orderItems.map(async (item) => {
      const medicine = await Medicine.findByIdAndUpdate(
        item.medicine,
        {
          $inc: {
            quantity: -item.quantity,
          },
        },
        { new: true }
      );
      return medicine;
    })
  );
});

const Order = model('Order', orderSchema);

module.exports = Order;
