const express = require('express');
const router = express.Router();
const CardDetails = require('../models/cardModel');

// @route   POST /api/payments/pay
// @desc    Process card payment
router.post('/pay', async (req, res) => {
  try {
    const { cardNumber, cvvcode, expmonthyear, cardholdername, amount, booking_id, user_id } = req.body;

    if (!cardNumber || !cvvcode || !expmonthyear || !cardholdername || !amount) {
      return res.status(400).json({
        success: false,
        message: 'All payment fields are required',
      });
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 12 || cleanCard.length > 19) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card number format',
      });
    }

    const transactionId = 'TXN_' + Date.now() + '_' + Math.floor(1000 + Math.random() * 9000);

    return res.json({
      success: true,
      transactionId,
      amount,
      message: 'Payment of $' + amount + ' processed successfully!',
    });
  } catch (error) {
    console.error('Error in payment route:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
});

module.exports = router;
