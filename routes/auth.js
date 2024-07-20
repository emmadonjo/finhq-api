const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { signUp } = require('../controllers/auth/authController');
const { verifyEmail, resendOtp } = require('../controllers/auth/emailVerifier');

router.post('/sign-up', guestMiddleware, signUp);
router.post('/verify-email', authMiddleware, verifyEmail);
router.post('/verify-email/resend-otp', authMiddleware, resendOtp);

module.exports = router;