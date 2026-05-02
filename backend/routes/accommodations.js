const express = require('express');
const {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAccommodationsInRadius,
} = require('../controllers/accommodationController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAccommodations)
  .post(protect, authorize('admin'), createAccommodation);

router.route('/:id')
  .get(getAccommodation)
  .put(protect, authorize('admin'), updateAccommodation)
  .delete(protect, authorize('admin'), deleteAccommodation);

router.get('/radius/:lat/:lng/:distance', getAccommodationsInRadius);

module.exports = router;
