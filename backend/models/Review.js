const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  accommodation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Accommodation',
    required: function() { return !this.placeId; },
  },
  placeId: {
    type: Number,
    required: function() { return !this.accommodation; },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Prevent user from submitting more than one review per property/place
reviewSchema.index({ accommodation: 1, user: 1 }, { unique: true, partialFilterExpression: { accommodation: { $exists: true } } });
reviewSchema.index({ placeId: 1, user: 1 }, { unique: true, partialFilterExpression: { placeId: { $exists: true } } });

// Static method to get average rating and save it to Accommodation (only for accommodations)
reviewSchema.statics.getAverageRating = async function (id, type = 'accommodation') {
  const match = type === 'accommodation' ? { accommodation: id } : { placeId: id };
  const groupById = type === 'accommodation' ? '$accommodation' : '$placeId';

  const obj = await this.aggregate([
    {
      $match: match
    },
    {
      $group: {
        _id: groupById,
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (type === 'accommodation') {
      if (obj[0]) {
        await mongoose.model('Accommodation').findByIdAndUpdate(id, {
          rating: obj[0].averageRating.toFixed(1),
          numReviews: obj[0].numReviews
        });
      } else {
        await mongoose.model('Accommodation').findByIdAndUpdate(id, {
          rating: 0,
          numReviews: 0
        });
      }
    }
    // Note: for static places, we return the average in the API instead of updating a DB record
    return obj[0] ? { averageRating: obj[0].averageRating.toFixed(1), numReviews: obj[0].numReviews } : { averageRating: 0, numReviews: 0 };
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
  if (this.accommodation) {
    this.constructor.getAverageRating(this.accommodation, 'accommodation');
  }
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
  if (this.accommodation) {
    this.constructor.getAverageRating(this.accommodation, 'accommodation');
  }
});

module.exports = mongoose.model('Review', reviewSchema);
