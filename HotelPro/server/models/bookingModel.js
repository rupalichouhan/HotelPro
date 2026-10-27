const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      unique: true,
      default: () => 'BK_' + Math.floor(100000 + Math.random() * 900000),
    },
    room_id: {
      type: String,
      required: [true, 'Room ID is required'],
    },
    user_id: {
      type: String,
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Guest name is required'],
    },
    fromdate: {
      type: String,
      required: [true, 'Check-in date is required'],
    },
    todate: {
      type: String,
      required: [true, 'Check-out date is required'],
    },
    totaldays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
