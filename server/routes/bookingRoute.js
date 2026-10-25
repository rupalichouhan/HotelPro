const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const CardDetails = require('../models/cardModel');

// Helper to parse dates formatted as 'YYYY-MM-DD' or 'DD-MM-YYYY'
const parseDate = (dStr) => {
  if (!dStr) return new Date();
  if (dStr.includes('-')) {
    const parts = dStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return new Date(dStr);
    } else {
      // DD-MM-YYYY
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }
  return new Date(dStr);
};

// @route   POST /api/bookings/bookroom
// @desc    Book a room, process payment card details, and update room bookings
router.post('/bookroom', async (req, res) => {
  try {
    const {
      room_id,
      user_id,
      fromdate,
      todate,
      totaldays,
      totalAmount,
      name,
      cardDetails,
    } = req.body;

    if (!room_id || !user_id || !fromdate || !todate || !totaldays || !totalAmount || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information',
      });
    }

    // Verify room exists
    let room = await Room.findOne({ $or: [{ room_id: room_id }, { _id: room_id.match(/^[0-9a-fA-F]{24}$/) ? room_id : null }] });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found for booking',
      });
    }

    // Check availability against existing bookings
    const reqStart = parseDate(fromdate).getTime();
    const reqEnd = parseDate(todate).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqStart >= reqEnd) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date range: Check-out must be after Check-in',
      });
    }

    const activeBookings = (room.currentBookings || []).filter((b) => b.status !== 'cancelled');
    let overlaps = 0;
    for (const b of activeBookings) {
      const bStart = parseDate(b.fromdate).getTime();
      const bEnd = parseDate(b.todate).getTime();
      // If requested interval overlaps with booking interval
      if (reqStart < bEnd && reqEnd > bStart) {
        overlaps++;
      }
    }

    const roomCapacity = room.count || 1;
    if (overlaps >= roomCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this room is already booked for the selected dates.',
      });
    }

    // Generate unique booking_id
    const generatedBookingId = 'BK_' + Math.floor(100000 + Math.random() * 900000);

    // Save Booking
    const newBooking = new Booking({
      booking_id: generatedBookingId,
      room_id: room.room_id || room._id.toString(),
      user_id: String(user_id),
      name: name.trim(),
      fromdate,
      todate,
      totaldays: Number(totaldays),
      totalAmount: Number(totalAmount),
      status: 'booked',
    });

    const savedBooking = await newBooking.save();

    // Save CardDetails if provided
    if (cardDetails && cardDetails.cardNumber) {
      const newCard = new CardDetails({
        booking_id: generatedBookingId,
        user_id: String(user_id),
        cardNumber: cardDetails.cardNumber.replace(/\s+/g, ''),
        cvvcode: cardDetails.cvvcode || '***',
        expmonthyear: cardDetails.expmonthyear || '',
        cardholdername: cardDetails.cardholdername || name,
      });
      await newCard.save();
    }

    // Update Room's currentBookings
    room.currentBookings.push({
      booking_id: generatedBookingId,
      fromdate: fromdate,
      todate: todate,
      user_id: String(user_id),
      status: 'booked',
    });

    await room.save();

    return res.status(201).json({
      success: true,
      message: 'Room booked successfully!',
      booking: savedBooking,
    });
  } catch (error) {
    console.error('Error booking room:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process booking',
      error: error.message,
    });
  }
});

// @route   POST /api/bookings/cancelbooking
// @desc    Cancel an existing booking and free room availability
router.post('/cancelbooking', async (req, res) => {
  try {
    const { booking_id, room_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required to cancel reservation',
      });
    }

    const booking = await Booking.findOne({ booking_id });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update room's currentBookings entry
    const targetRoomId = room_id || booking.room_id;
    const room = await Room.findOne({
      $or: [{ room_id: targetRoomId }, { _id: targetRoomId.match(/^[0-9a-fA-F]{24}$/) ? targetRoomId : null }],
    });

    if (room && room.currentBookings) {
      room.currentBookings = room.currentBookings.filter((b) => b.booking_id !== booking_id);
      await room.save();
    }

    return res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
});

// @route   POST /api/bookings/getbookingsbyuserid
// @desc    Get all bookings made by a specific user
router.post('/getbookingsbyuserid', async (req, res) => {
  try {
    const { user_id, userId } = req.body;
    const uid = user_id || userId;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const bookings = await Booking.find({ user_id: String(uid) }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error getting bookings by user id:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message,
    });
  }
});

// @route   GET /api/bookings/getallbookings
// @desc    Get all bookings across the system (for Admin Dashboard)
router.get('/getallbookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve all bookings',
      error: error.message,
    });
  }
});

module.exports = router;
