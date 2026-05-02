const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  itemType: {
    type: String,
    enum: ['Hotel', 'Place'],
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  itemName: String,
  itemImage: String,
  itemLocation: String,
  checkIn: {
    type: Date,
    required: [true, 'Please add check-in date'],
  },
  checkOut: {
    type: Date,
  },
  guests: {
    type: Number,
    required: [true, 'Please specify guest count'],
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  couponCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  whatsappConfirmation: {
    type: Boolean,
    default: false
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  // QR Ticket System fields
  ticketNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCodeUrl: String,
  qrScanned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

// Generate ticket number before saving if confirmed
bookingSchema.pre('save', function(next) {
  if (this.status === 'confirmed' && !this.ticketNumber) {
    this.ticketNumber = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
