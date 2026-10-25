const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      default: () => 'RM_' + Math.floor(1000 + Math.random() * 9000),
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    photos: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Rent per night is required'],
      min: 0,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentBookings: [
      {
        booking_id: { type: String, required: true },
        fromdate: { type: String, required: true },
        todate: { type: String, required: true },
        user_id: { type: String, required: true },
        status: { type: String, default: 'booked' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
