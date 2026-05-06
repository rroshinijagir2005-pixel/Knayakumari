const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['Hotel', 'Accommodation'],
    default: 'Accommodation'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: [
      'Report Closed', 
      'Wrong Contact Info', 
      'Wrong Photos', 
      'Price Mismatch', 
      'Fake Listing',
      'Wrong Map Location',
      'No Rooms Available'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  severity: {
    type: Number,
    default: 1 // 1: Low, 2: Medium, 3: High
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to determine severity based on reportType
reportSchema.pre('save', function(next) {
  if (this.reportType === 'Fake Listing' || this.reportType === 'No Rooms Available' || this.reportType === 'Report Closed') {
    this.severity = 3;
  } else if (this.reportType === 'Wrong Map Location' || this.reportType === 'Price Mismatch') {
    this.severity = 2;
  } else {
    this.severity = 1;
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
