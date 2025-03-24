const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const superAdminAuth = require('../middleware/superAdminAuth');

// Admin authentication routes
// @route   POST /api/admin/register
// @desc    Register a new admin
// @access  Private/Super Admin
router.post('/register', auth, superAdminAuth, adminController.registerAdmin);

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', adminController.loginAdmin);

// User management routes
// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', auth, adminAuth, adminController.getUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/users/:id', auth, adminAuth, adminController.getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', auth, adminAuth, adminController.updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);

// Ranking management routes
// @route   PUT /api/admin/rankings/:userId
// @desc    Adjust user ranking
// @access  Private/Admin
router.put('/rankings/:userId', auth, adminAuth, adminController.adjustRanking);

// Dashboard stats
// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/stats', auth, adminAuth, adminController.getDashboardStats);

module.exports = router;
