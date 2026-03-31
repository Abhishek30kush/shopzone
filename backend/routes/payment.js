
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// Lazy load Razorpay only when needed
let razorpay = null;
const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) {
      return res.status(503).json({ message: 'Payment gateway not configured' });
    }

    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await rp.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'Completed',
          update_time: Date.now(),
          email_address: req.user.email
        };
        order.paymentStatus = 'Paid';
        await order.save();
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key
// @access  Public
router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
});

module.exports = router;

