const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    itemType: {
      type: String,
      enum: ['Hotel', 'Place'],
      required: true
    },
    itemId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'items.itemType'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
