const express = require('express');
const { getStats } = require('../controllers/adminController');
// const { protect, authorize } = require('../middleware/auth'); // assuming we have auth middleware

const router = express.Router();

// protect and authorize middleware can be added here for 'admin' role
router.get('/stats', getStats);

module.exports = router;
