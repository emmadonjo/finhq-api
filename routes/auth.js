const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const { signup } = require('../validations/auth-validations');

const { signUp } = require('../controllers/auth/authController');

// router.post('/sign-up', guestMiddleware, signup, signUp);
router.post('/sign-up', guestMiddleware, signUp);

module.exports = router;