const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getBookings,
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking)
  .get(protect, authorize('admin'), getBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBooking);

router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
