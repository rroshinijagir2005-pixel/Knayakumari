const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Accommodation = require('../models/Accommodation');

// @desc    Get all accommodations
// @route   GET /api/accommodations
// @access  Public
exports.getAccommodations = asyncHandler(async (req, res, next) => {
  let query;

  // Copy query params
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'tribalOnly'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource - filter out Permanently Closed and Suspended unless admin
  let filterObj = JSON.parse(queryStr);
  
  if (!req.user || req.user.role !== 'admin') {
    filterObj.status = { $nin: ['Permanently Closed', 'Suspended', 'Under Review'] };
  }

  query = Accommodation.find(filterObj);

  // Search filter
  if (req.query.search) {
    query = query.find({
      name: { $regex: req.query.search, $options: 'i' }
    });
  }

  // Tribal Owned filter
  if (req.query.tribalOnly === 'true') {
    query = query.find({ isTribalOwned: true });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Accommodation.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const accommodations = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: accommodations.length,
    pagination,
    data: accommodations
  });
});

// @desc    Get single accommodation
// @route   GET /api/accommodations/:id
// @access  Public
exports.getAccommodation = asyncHandler(async (req, res, next) => {
  const accommodation = await Accommodation.findById(req.params.id).populate('reviews');

  if (!accommodation) {
    return next(
      new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: accommodation
  });
});

// @desc    Create new accommodation
// @route   POST /api/accommodations
// @access  Private (Admin)
exports.createAccommodation = asyncHandler(async (req, res, next) => {
  const accommodation = await Accommodation.create(req.body);

  res.status(201).json({
    success: true,
    data: accommodation
  });
});

// @desc    Update accommodation
// @route   PUT /api/accommodations/:id
// @access  Private (Admin)
exports.updateAccommodation = asyncHandler(async (req, res, next) => {
  let accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return next(
      new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404)
    );
  }

  accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: accommodation
  });
});

// @desc    Delete accommodation
// @route   DELETE /api/accommodations/:id
// @access  Private (Admin)
exports.deleteAccommodation = asyncHandler(async (req, res, next) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    return next(
      new ErrorResponse(`Accommodation not found with id of ${req.params.id}`, 404)
    );
  }

  await accommodation.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get accommodations within a radius
// @route   GET /api/accommodations/radius/:zipcode/:distance
// @access  Public
exports.getAccommodationsInRadius = asyncHandler(async (req, res, next) => {
  const { lat, lng, distance } = req.params;

  // Earth radius in km
  const radius = distance / 6378;

  const accommodations = await Accommodation.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: accommodations.length,
    data: accommodations
  });
});

// @desc    Check for duplicate listings
// @route   GET /api/accommodations/admin/duplicates
// @access  Private (Admin)
exports.checkDuplicates = asyncHandler(async (req, res, next) => {
  // Simple heuristic: group by name (lowercase) or exact address
  const accommodations = await Accommodation.find().select('name address location type contactPhone');
  
  const duplicates = [];
  const map = new Map();

  accommodations.forEach(acc => {
    // Normalize keys
    const nameKey = acc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const phoneKey = acc.contactPhone ? acc.contactPhone.replace(/[^0-9]/g, '') : null;
    
    // Check by name
    if (map.has(nameKey)) {
      duplicates.push({ type: 'Name Match', current: acc, existing: map.get(nameKey) });
    } else {
      map.set(nameKey, acc);
    }
    
    // Check by phone
    if (phoneKey) {
      if (map.has(`phone_${phoneKey}`)) {
        duplicates.push({ type: 'Phone Match', current: acc, existing: map.get(`phone_${phoneKey}`) });
      } else {
        map.set(`phone_${phoneKey}`, acc);
      }
    }
  });

  res.status(200).json({
    success: true,
    count: duplicates.length,
    data: duplicates
  });
});

// @desc    Get stale listings (not updated in 90 days)
// @route   GET /api/accommodations/admin/stale
// @access  Private (Admin)
exports.getStaleListings = asyncHandler(async (req, res, next) => {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  const staleListings = await Accommodation.find({
    updatedAt: { $lt: ninetyDaysAgo }
  });

  res.status(200).json({
    success: true,
    count: staleListings.length,
    data: staleListings
  });
});

