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
  status: {
    type: String,
    enum: ['Active', 'Limited Availability', 'Temporarily Closed', 'Under Renovation', 'Permanently Closed', 'Under Review', 'Suspended'],
    default: 'Active'
  },
  verification: {
    verifiedToday: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    recentlyUpdated: { type: Boolean, default: false },
    localPartnerVerified: { type: Boolean, default: false },
    ownerUploadedPhotos: { type: Boolean, default: false },
    lastVerifiedDate: { type: Date }
  },
  userPhotos: [{ type: String }],
  adminNotes: [{
    note: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  reportCount: {
    type: Number,
    default: 0
  },
  contactInfo: {
    phone: String,
    whatsapp: String
  },
  urgencyMetrics: {
    roomsLeft: Number,
    bookedToday: Number,
    bestSeller: { type: Boolean, default: false },
    peakSeasonWarning: { type: Boolean, default: false }
  },
  localContext: {
    nearbyPlaces: [{ name: String, distance: String }],
    nearbyFood: [String],
    nearbyCulture: [String]
  }
}, {
  timestamps: true,
});

accommodationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Accommodation', accommodationSchema);
