const express = require('express');
const router = express.Router();
const { login, getMe, logout, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login',           login);
router.get('/me',               authenticate, getMe);
router.post('/logout',          authenticate, logout);
router.put('/change-password',  authenticate, changePassword);

module.exports = router;
