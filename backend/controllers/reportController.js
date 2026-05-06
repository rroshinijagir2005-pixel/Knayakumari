const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Report = require('../models/Report');
const Accommodation = require('../models/Accommodation');
const Hotel = require('../models/Hotel');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Public (can be authenticated)
exports.createReport = asyncHandler(async (req, res, next) => {
  const { hotelId, targetModel, reportType, description } = req.body;
  
  if (!hotelId || !reportType) {
    return next(new ErrorResponse('Please provide hotelId and reportType', 400));
  }

  // Set user if authenticated (assuming protect middleware might be used, otherwise userId is optional)
  const userId = req.user ? req.user.id : null;

  const report = await Report.create({
    hotelId,
    targetModel: targetModel || 'Accommodation',
    userId,
    reportType,
    description
  });

  // Smart Alert Logic: check if we need to auto-hide or flag the listing
  const Model = report.targetModel === 'Hotel' ? Hotel : Accommodation;
  const listing = await Model.findById(hotelId);

  if (listing) {
    // Increment report count
    listing.reportCount = (listing.reportCount || 0) + 1;
    
    // Calculate severe reports for this listing
    const severeReportsCount = await Report.countDocuments({
      hotelId,
      status: 'Pending',
      severity: 3
    });

    // Auto-hide threshold: e.g., 3 severe complaints
    if (severeReportsCount >= 3 && listing.status !== 'Suspended' && listing.status !== 'Under Review') {
      listing.status = 'Under Review';
      listing.adminNotes.push({
        note: `Automatically flagged as 'Under Review' due to ${severeReportsCount} severe reports.`,
        createdAt: Date.now()
      });
    }

    await listing.save();
  }

  res.status(201).json({
    success: true,
    data: report,
    message: 'Report submitted successfully. Thank you for helping us maintain quality.'
  });
});

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private (Admin)
exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find().sort('-createdAt').populate('hotelId', 'name status');

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
exports.updateReport = asyncHandler(async (req, res, next) => {
  let report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ErrorResponse(`Report not found with id of ${req.params.id}`, 404));
  }

  report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: report
  });
});
