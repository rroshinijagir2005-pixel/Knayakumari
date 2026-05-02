const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const Accommodation = require('../models/Accommodation');
const razorpay = require('../config/razorpay');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { accommodationId, checkIn, checkOut, guests, rooms, whatsappConfirmation, itemName, itemImage, itemLocation, finalTotal } = req.body;
  const mongoose = require('mongoose');

  // Map frontend accommodationId to itemId and itemType
  const itemType = 'Hotel';
  const itemId = String(accommodationId);

  // Check if itemId is a valid MongoDB ObjectId
  let hotel = null;
  if (mongoose.Types.ObjectId.isValid(itemId)) {
    try {
      hotel = await require('../models/Hotel').findById(itemId);
    } catch (e) {
      console.error('Hotel lookup failed:', e.message);
    }
  }

  let calculatedTotal = finalTotal; // Safely use frontend total if static data

  // If it is a real DB hotel, we recalculate securely on the server
  if (hotel) {
    let basePrice = hotel.discountedPrice || hotel.pricePerNight || 1000;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const safeRooms = rooms || 1;
    const baseTotal = basePrice * nights * safeRooms;
    const tax = baseTotal * 0.18;
    calculatedTotal = baseTotal + tax;
  }

  if (!calculatedTotal) {
    return next(new ErrorResponse('Could not determine price for this booking', 400));
  }

  const booking = await Booking.create({
    user: req.user.id,
    itemType,
    itemId,
    itemName,
    itemImage,
    itemLocation,
    checkIn,
    checkOut,
    guests,
    totalPrice: calculatedTotal,
    whatsappConfirmation,
    status: 'pending',
    paymentStatus: 'unpaid'
  });

  res.status(201).json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email');

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this booking', 401));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this booking', 401));
  }

  if (booking.status === 'cancelled') {
    return next(new ErrorResponse('Booking is already cancelled', 400));
  }

  booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});
