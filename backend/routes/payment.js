const express = require('express');
const {
  verifyPayment,
  paymentWebhook,
  createOrder,
} = require('../controllers/paymentController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', paymentWebhook);

module.exports = router;
