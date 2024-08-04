const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { signUp, signIn, logout } = require('../controllers/auth/authController');
const { verifyEmail, resendOtp } = require('../controllers/auth/emailVerifier');
const { sendOtp, resetPassword } = require('../controllers/auth/passwordController');
const { getProfile } = require('../controllers/profileController');

router.post('/sign-up', guestMiddleware, signUp);
router.post('/sign-in', guestMiddleware, signIn);
router.post('/logout', authMiddleware, logout);
router.post('/verify-email', authMiddleware, verifyEmail);
router.post('/verify-email/resend-otp', authMiddleware, resendOtp);
router.post('/password/request', guestMiddleware, sendOtp);
router.post('/password/reset', guestMiddleware, resetPassword);

router.get('/profile', authMiddleware, getProfile);

module.exports = router;