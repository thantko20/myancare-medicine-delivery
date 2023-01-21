const { Schema, model, default: mongoose } = require('mongoose');

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      max: 599,
      // select: false,
    },
    expiredDate: {
      type: Date,
      default: new Date('2025-12-18').toISOString(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtual: true },
  }
);

medicineSchema.virtual('outOfStock').get(function () {
  return this.quantity === 0;
});

medicineSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'text -_id',
  });
  next();
});

const Medicine = model('Medicine', medicineSchema);

module.exports = Medicine;
