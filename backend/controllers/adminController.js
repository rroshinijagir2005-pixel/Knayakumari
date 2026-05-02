const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Place = require('../models/Place');
const Booking = require('../models/Booking');

exports.getStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const hotelCount = await Hotel.countDocuments();
    const placeCount = await Place.countDocuments();
    const bookingCount = await Booking.countDocuments();

    const revenueAggr = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const revenue = revenueAggr.length > 0 ? revenueAggr[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        hotels: hotelCount,
        places: placeCount,
        bookings: bookingCount,
        revenue
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
