const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a property name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  type: {
    type: String,
    required: [true, 'Please specify stay type'],
    enum: ['hotel', 'resort', 'homestay', 'villa', 'eco-lodge'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
    address: String,
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  images: [
    {
      type: String, // URLs to Cloudinary or generic images
    }
  ],
  amenities: [String],
  isTribalOwned: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  bestTimeToVisit: String,
}, {
  timestamps: true,
});

accommodationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Accommodation', accommodationSchema);
