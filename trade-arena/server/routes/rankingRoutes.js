const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/rankings/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', rankingController.getLeaderboard);

// @route   GET /api/rankings/user
// @desc    Get user ranking
// @access  Private
router.get('/user', auth, rankingController.getUserRanking);

// @route   GET /api/rankings/tiers
// @desc    Get rank tiers
// @access  Public
router.get('/tiers', rankingController.getRankTiers);

// @route   POST /api/rankings/update
// @desc    Update all rankings (admin only or scheduled task)
// @access  Private/Admin
router.post('/update', auth, adminAuth, rankingController.updateRankings);

module.exports = router;
