const mongoose = require('mongoose');

const cardDetailsSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
    },
    cardNumber: {
      type: String,
      required: [true, 'Card number is required'],
    },
    cvvcode: {
      type: String,
      required: [true, 'CVV code is required'],
    },
    expmonthyear: {
      type: String,
      required: [true, 'Expiration date is required'],
    },
    cardholdername: {
      type: String,
      required: [true, 'Cardholder name is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CardDetails', cardDetailsSchema);
