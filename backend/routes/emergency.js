const express = require('express');
const {
  triggerSOS,
  getAlerts,
  resolveAlert,
} = require('../controllers/emergencyController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.post('/sos', protect, triggerSOS);

router.get('/alerts', protect, authorize('admin', 'staff'), getAlerts);
router.put('/alerts/:id', protect, authorize('admin', 'staff'), resolveAlert);

module.exports = router;
