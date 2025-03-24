const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// @route   POST /api/trades
// @desc    Create a new trade
// @access  Private
router.post('/', auth, tradeController.createTrade);

// @route   GET /api/trades
// @desc    Get all trades for a user
// @access  Private
router.get('/', auth, tradeController.getUserTrades);

// @route   GET /api/trades/:id
// @desc    Get a single trade by ID
// @access  Private
router.get('/:id', auth, tradeController.getTradeById);

// @route   PUT /api/trades/:id
// @desc    Update a trade
// @access  Private
router.put('/:id', auth, tradeController.updateTrade);

// @route   DELETE /api/trades/:id
// @desc    Delete a trade
// @access  Private
router.delete('/:id', auth, tradeController.deleteTrade);

// @route   GET /api/trades/stats
// @desc    Get trade statistics
// @access  Private
router.get('/stats/summary', auth, tradeController.getTradeStats);

module.exports = router;
