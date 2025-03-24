const JournalEntry = require('../models/JournalEntry');
const Trade = require('../models/Trade');
const User = require('../models/User');

// Create a new journal entry
exports.createJournalEntry = async (req, res) => {
  try {
    const { date, content, screenshots, isPublic } = req.body;

    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Journal entry content is required' });
    }

    // Get trades for the day to calculate daily profit/loss
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const trades = await Trade.find({
      user: req.user.id,
      date: { $gte: dayStart, $lte: dayEnd }
    });
    
    // Calculate daily profit/loss
    const dailyProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    
    // Create new journal entry
    const newJournalEntry = new JournalEntry({
      user: req.user.id,
      date: new Date(date),
      content,
      screenshots: screenshots || [],
      isPublic: isPublic || false,
      trades: trades.map(trade => trade._id),
      dailyProfitLoss
    });

    const journalEntry = await newJournalEntry.save();
    res.status(201).json(journalEntry);
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ message: 'Server error during journal entry creation' });
  }
};

// Get all journal entries for a user
exports.getUserJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('trades');
    
    res.json(entries);
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ message: 'Server error while fetching journal entries' });
  }
};

// Get a single journal entry by ID
exports.getJournalEntryById = async (req, res) => {
  try {
    const journalEntry = await JournalEntry.findById(req.params.id)
      .populate('trades');
    
    // Check if journal entry exists
    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check if journal entry belongs to user or is public
    if (journalEntry.user.toString() !== req.user.id && !journalEntry.isPublic) {
      return res.status(401).json({ message: 'Not authorized to access this journal entry' });
    }
    
    res.json(journalEntry);
  } catch (error) {
    console.error('Get journal entry by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching journal entry' });
  }
};

// Get journal entries by date
exports.getJournalEntriesByDate = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1; // JavaScript months are 0-indexed
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }
    
    // Get start and end of month
    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
    
    // Get all journal entries for the month
    const entries = await JournalEntry.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    // Get all trades for the month to calculate daily P/L for days without journal entries
    const trades = await Trade.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Group trades by day
    const tradesByDay = {};
    trades.forEach(trade => {
      const tradeDate = new Date(trade.date);
      const dateKey = tradeDate.toISOString().split('T')[0];
      
      if (!tradesByDay[dateKey]) {
        tradesByDay[dateKey] = [];
      }
      
      tradesByDay[dateKey].push(trade);
    });
    
    // Calculate daily P/L for each day in the month
    const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();
    const calendarData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(yearNum, monthNum, day);
      const dateKey = date.toISOString().split('T')[0];
      
      // Find journal entry for this day
      const entry = entries.find(e => {
        const entryDate = new Date(e.date);
        return entryDate.getDate() === day;
      });
      
      // Calculate daily P/L
      const dailyTrades = tradesByDay[dateKey] || [];
      const dailyProfitLoss = dailyTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      
      calendarData.push({
        date,
        hasEntry: !!entry,
        entryId: entry ? entry._id : null,
        isPublic: entry ? entry.isPublic : false,
        dailyProfitLoss,
        tradesCount: dailyTrades.length
      });
    }
    
    res.json(calendarData);
  } catch (error) {
    console.error('Get journal entries by date error:', error);
    res.status(500).json({ message: 'Server error while fetching journal entries by date' });
  }
};

// Update a journal entry
exports.updateJournalEntry = async (req, res) => {
  try {
    const { content, screenshots, isPublic } = req.body;
    
    // Find the journal entry
    let journalEntry = await JournalEntry.findById(req.params.id);
    
    // Check if journal entry exists
    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check if journal entry belongs to user
    if (journalEntry.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this journal entry' });
    }
    
    // Update journal entry fields
    if (content) journalEntry.content = content;
    if (screenshots) journalEntry.screenshots = screenshots;
    if (isPublic !== undefined) journalEntry.isPublic = isPublic;
    
    // Save updated journal entry
    journalEntry = await journalEntry.save();
    
    res.json(journalEntry);
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ message: 'Server error during journal entry update' });
  }
};

// Delete a journal entry
exports.deleteJournalEntry = async (req, res) => {
  try {
    const journalEntry = await JournalEntry.findById(req.params.id);
    
    // Check if journal entry exists
    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check if journal entry belongs to user
    if (journalEntry.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this journal entry' });
    }
    
    await journalEntry.deleteOne();
    
    res.json({ message: 'Journal entry removed' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ message: 'Server error during journal entry deletion' });
  }
};

// Get public journal entries
exports.getPublicJournalEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const entries = await JournalEntry.find({ isPublic: true })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username displayName profilePicture');
    
    const totalEntries = await JournalEntry.countDocuments({ isPublic: true });
    const totalPages = Math.ceil(totalEntries / limit);
    
    res.json({
      entries,
      pagination: {
        page,
        limit,
        totalEntries,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get public journal entries error:', error);
    res.status(500).json({ message: 'Server error while fetching public journal entries' });
  }
};
