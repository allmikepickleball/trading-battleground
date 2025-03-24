const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, journalController.createJournalEntry);

// @route   GET /api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', auth, journalController.getUserJournalEntries);

// @route   GET /api/journal/:id
// @desc    Get a single journal entry by ID
// @access  Private
router.get('/:id', auth, journalController.getJournalEntryById);

// @route   GET /api/journal/date/:year/:month
// @desc    Get journal entries by date
// @access  Private
router.get('/date/:year/:month', auth, journalController.getJournalEntriesByDate);

// @route   PUT /api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, journalController.updateJournalEntry);

// @route   DELETE /api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, journalController.deleteJournalEntry);

// @route   GET /api/journal/public
// @desc    Get public journal entries
// @access  Public
router.get('/public', journalController.getPublicJournalEntries);

module.exports = router;
