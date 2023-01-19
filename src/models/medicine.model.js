const { Schema, model } = require('mongoose');

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
      type: String,
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
    countInstock: {
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

medicineSchema.virtual('isInStock').get(function () {
  return this.countInstock > 0;
});

const Medicine = model('Medicine', medicineSchema);

module.exports = Medicine;
