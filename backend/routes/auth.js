const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
