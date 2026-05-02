const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    enum: ['Hotel', 'Resort', 'Homestay', 'Eco-lodge'],
    required: true
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price per night']
  },
  address: {
    street: String,
    city: {
      type: String,
      default: 'Kanniyakumari'
    },
    zipcode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: {
    type: [String],
    required: true
  },
  tags: {
    isLuxury: { type: Boolean, default: false },
    isFamilyFriendly: { type: Boolean, default: false },
    isNearBeach: { type: Boolean, default: false },
    hasSeaView: { type: Boolean, default: false },
    isNearTemple: { type: Boolean, default: false },
    isNearStation: { type: Boolean, default: false },
    hasSunriseView: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    hasFreeParking: { type: Boolean, default: false }
  },
  images: {
    type: [String],
    default: ['default-hotel.jpg']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 4.0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isTribalOwned: {
    type: Boolean,
    default: false
  },
  contactEmail: String,
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);
