const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const razorpay = require('../config/razorpay');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  const options = {
    amount: Math.round(booking.totalPrice * 100), // amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: booking._id.toString(),
  };

  try {
    const order = await razorpay.orders.create(options);
    
    // Update booking with razorpayOrderId
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Razorpay Error details:', JSON.stringify(error, null, 2));
    
    // Attempt to extract the detailed Razorpay description
    const errorMessage = error.error?.description || error.message || 'Error creating Razorpay order';
    
    return next(new ErrorResponse(errorMessage, 500));
  }
});

const whatsappService = require('../services/whatsappService');

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId
  } = req.body;

  let isAuthentic = false;

  // Support strict verification
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return next(new ErrorResponse('Payment verification failed - missing server configuration', 500));
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // 1. Find the booking
    const booking = await Booking.findById(bookingId).populate('user', 'name phone');
    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    if (booking.status === 'confirmed' || booking.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified previously',
      });
    }

    // 2. Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    // 3. Create payment record
    const existingPayment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!existingPayment) {
      await Payment.create({
        booking: booking._id,
        user: req.user.id,
        amount: booking.totalPrice,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: booking.razorpayPaymentId,
        razorpaySignature: razorpay_signature,
        status: 'captured',
      });
    }

    // 4. Send WhatsApp Notification
    if (booking.whatsappConfirmation) {
      whatsappService.sendWhatsAppConfirmation({
        bookingId: booking._id.toString(),
        guestName: booking.user?.name || 'Guest',
        phone: req.body.phone || '+910000000000', // Assuming phone is passed or available on user
        hotelName: booking.itemName,
        checkIn: new Date(booking.checkIn).toLocaleDateString(),
        checkOut: new Date(booking.checkOut).toLocaleDateString(),
        paymentStatus: 'PAID',
        mapLink: 'https://maps.google.com/?q=' + encodeURIComponent(booking.itemLocation),
        hotelContact: 'See booking details'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed',
    });
  } else {
    return next(new ErrorResponse('Payment verification failed', 400));
  }
});

// @desc    Razorpay Webhook handler (for async payment confirmations)
// @route   POST /api/payment/webhook
// @access  Public
exports.paymentWebhook = asyncHandler(async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('Webhook verification successful');
    const event = req.body.event;

    // Logic for capturing payment via webhook if frontend modal failed
    if (event === 'payment.captured') {
        const paymentPayload = req.body.payload.payment.entity;
        const orderId = paymentPayload.order_id;
        
        const booking = await Booking.findOne({ razorpayOrderId: orderId });
        if (booking && booking.status !== 'confirmed') {
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            booking.razorpayPaymentId = paymentPayload.id;
            await booking.save();
            
            // Create payment record if it doesn't exist
            const existingPayment = await Payment.findOne({ razorpayOrderId: orderId });
            if (!existingPayment) {
                await Payment.create({
                    booking: booking._id,
                    user: booking.user,
                    amount: booking.totalPrice,
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentPayload.id,
                    status: 'captured',
                });
            }
        }
    }

    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).send('Invalid webhook signature');
  }
});
