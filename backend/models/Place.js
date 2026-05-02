const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a place name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  longDescription: {
    type: String
  },
  category: {
    type: String,
    enum: ['Religious', 'Nature', 'Historical', 'Excursions', 'Cultural', 'Parks & Gardens', 'Beaches'],
    required: true
  },
  images: {
    type: [String],
    default: ['default-place.jpg']
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  bestTimeToVisit: String,
  openingHours: String,
  entryFee: {
    type: Number,
    default: 0
  },
  photographerTips: String,
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 4.5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  popularityRank: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Place', placeSchema);
