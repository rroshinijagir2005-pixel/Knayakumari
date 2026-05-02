const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false-alarm'],
    default: 'active',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  resolutionNotes: String,
  respondedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
