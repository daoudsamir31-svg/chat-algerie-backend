const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// مسار التسجيل
router.post('/signup', signup);

// مسار تسجيل الدخول
router.post('/login', login);

module.exports = router; 
