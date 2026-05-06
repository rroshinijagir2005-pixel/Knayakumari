const express = require('express');
const { createReport, getReports, updateReport } = require('../controllers/reportController');

const router = express.Router();

// Public / Authenticated route to create report
router.post('/', createReport);

// Admin routes
router.get('/', getReports);
router.put('/:id', updateReport);

module.exports = router;
