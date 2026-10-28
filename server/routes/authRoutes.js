const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  demoLogin,
  adminCreateStudent,
  adminGetStudents,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin Student Management
router.post('/admin/students', protect, authorize('admin', 'coordinator'), adminCreateStudent);
router.get('/admin/students', protect, authorize('admin', 'coordinator'), adminGetStudents);

module.exports = router;
