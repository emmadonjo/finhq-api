const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const { signUp } = require('../controllers/auth/authController');

router.post('/sign-up', guestMiddleware, signUp);

module.exports = router;