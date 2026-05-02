const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews for a place or accommodation
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const isPlace = !req.params.id.match(/^[0-9a-fA-F]{24}$/);
  const query = isPlace ? { placeId: parseInt(req.params.id) } : { accommodation: req.params.id };

  const reviews = await Review.find(query)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.name = req.user.name;

  // Check if placeId is present (for Visiting Places) or accommodation (for properties)
  if (!req.body.placeId && !req.body.accommodation) {
    return next(new ErrorResponse('Please provide either a placeId or accommodation ID', 400));
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpful: 1 } },
    { new: true, runValidators: true }
  );

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Get average rating
// @route   GET /api/reviews/:id/average
// @access  Public
exports.getAverageRating = asyncHandler(async (req, res, next) => {
  const isPlace = !req.params.id.match(/^[0-9a-fA-F]{24}$/);
  const id = isPlace ? parseInt(req.params.id) : req.params.id;
  const type = isPlace ? 'place' : 'accommodation';

  const stats = await Review.getAverageRating(id, type);

  res.status(200).json({
    success: true,
    data: stats
  });
});
