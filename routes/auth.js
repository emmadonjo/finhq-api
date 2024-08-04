const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { signUp, signIn, logout } = require('../controllers/auth/authController');
const { verifyEmail, resendOtp } = require('../controllers/auth/emailVerifier');
const { sendOtp } = require('../controllers/auth/passwordController');

router.post('/sign-up', guestMiddleware, signUp);
router.post('/sign-in', guestMiddleware, signIn);
router.post('/logout', authMiddleware, logout);
router.post('/verify-email', authMiddleware, verifyEmail);
router.post('/verify-email/resend-otp', authMiddleware, resendOtp);
router.post('/password/request', guestMiddleware, sendOtp);

module.exports = router;