const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: () => 'USR_' + Math.floor(100000 + Math.random() * 900000),
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    c_password: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
