const express = require('express');
const {
  getReviews,
  addReview,
  deleteReview,
  markHelpful,
  getAverageRating
} = require('../controllers/reviewController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .post(protect, addReview);

router
  .route('/:id')
  .get(getReviews)
  .delete(protect, deleteReview);

router
  .route('/:id/helpful')
  .put(protect, markHelpful);

router
  .route('/:id/average')
  .get(getAverageRating);

module.exports = router;
