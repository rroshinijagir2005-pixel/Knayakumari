const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const EmergencyAlert = require('../models/EmergencyAlert');
const { getIO } = require('../config/socket');

// @desc    Trigger SOS alert
// @route   POST /api/emergency/sos
// @access  Private
exports.triggerSOS = asyncHandler(async (req, res, next) => {
  const { location } = req.body;

  const alert = await EmergencyAlert.create({
    user: req.user.id,
    location,
    status: 'active',
  });

  const alertWithUser = await EmergencyAlert.findById(alert._id).populate('user', 'name phone');

  // Trigger Real-time alert to all admins
  const io = getIO();
  io.emit('emergency_alert', alertWithUser);

  // In production, you would also trigger an SMS/Email here
  // sendEmergencySMS(alertWithUser);

  res.status(201).json({
    success: true,
    message: 'SOS ALERT TRIGGERED! Help is being notified.',
    data: alertWithUser,
  });
});

// @desc    Get active alerts
// @route   GET /api/emergency/alerts
// @access  Private (Admin)
exports.getAlerts = asyncHandler(async (req, res, next) => {
  const alerts = await EmergencyAlert.find({ status: 'active' })
    .populate('user', 'name phone email')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});

// @desc    Update alert status
// @route   PUT /api/emergency/alerts/:id
// @access  Private (Admin)
exports.resolveAlert = asyncHandler(async (req, res, next) => {
  const { status, resolutionNotes } = req.body;

  const alert = await EmergencyAlert.findByIdAndUpdate(
    req.params.id,
    {
      status,
      resolutionNotes,
      respondedBy: req.user.id,
    },
    { new: true, runValidators: true }
  );

  if (!alert) {
    return next(new ErrorResponse('Alert not found', 404));
  }

  res.status(200).json({
    success: true,
    data: alert,
  });
});
