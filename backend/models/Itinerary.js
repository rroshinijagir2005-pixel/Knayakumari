const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  dayNumber: Number,
  date: Date,
  weatherForecast: {
    temp: Number,
    condition: String,
    icon: String
  },
  activities: [{
    timeSlot: String, // e.g., 'Morning (9 AM - 12 PM)'
    placeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Place'
    },
    activityType: String,
    notes: String
  }],
  estimatedCost: Number
});

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    default: 1
  },
  budget: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    default: 'moderate'
  },
  pace: {
    type: String,
    enum: ['relaxed', 'moderate', 'packed'],
    default: 'moderate'
  },
  interests: [String],
  days: [itineraryDaySchema],
  totalEstimatedCost: Number,
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
