const Trade = require('../models/Trade');
const User = require('../models/User');

// Create a new trade
exports.createTrade = async (req, res) => {
  try {
    const {
      tradeType,
      assetType,
      symbol,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      leverage,
      date,
      notes
    } = req.body;

    // Create new trade
    const newTrade = new Trade({
      user: req.user.id,
      tradeType,
      assetType,
      symbol,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      leverage,
      date: new Date(date),
      notes
    });

    const trade = await newTrade.save();
    res.status(201).json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ message: 'Server error during trade creation' });
  }
};

// Get all trades for a user
exports.getUserTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ date: -1 });
    res.json(trades);
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({ message: 'Server error while fetching trades' });
  }
};

// Get a single trade by ID
exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    // Check if trade belongs to user
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to access this trade' });
    }
    
    res.json(trade);
  } catch (error) {
    console.error('Get trade by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching trade' });
  }
};

// Update a trade
exports.updateTrade = async (req, res) => {
  try {
    const {
      tradeType,
      assetType,
      symbol,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      leverage,
      date,
      notes
    } = req.body;
    
    // Find the trade
    let trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    // Check if trade belongs to user
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this trade' });
    }
    
    // Update trade fields
    if (tradeType) trade.tradeType = tradeType;
    if (assetType) trade.assetType = assetType;
    if (symbol) trade.symbol = symbol;
    if (entryPrice) trade.entryPrice = entryPrice;
    if (exitPrice) trade.exitPrice = exitPrice;
    if (quantity) trade.quantity = quantity;
    if (stopLoss !== undefined) trade.stopLoss = stopLoss;
    if (takeProfit !== undefined) trade.takeProfit = takeProfit;
    if (leverage) trade.leverage = leverage;
    if (date) trade.date = new Date(date);
    if (notes !== undefined) trade.notes = notes;
    
    // Save updated trade
    trade = await trade.save();
    
    res.json(trade);
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ message: 'Server error during trade update' });
  }
};

// Delete a trade
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    
    // Check if trade exists
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    // Check if trade belongs to user
    if (trade.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this trade' });
    }
    
    await trade.deleteOne();
    
    res.json({ message: 'Trade removed' });
  } catch (error) {
    console.error('Delete trade error:', error);
    res.status(500).json({ message: 'Server error during trade deletion' });
  }
};

// Get trade statistics
exports.getTradeStats = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id });
    
    if (trades.length === 0) {
      return res.json({
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        averageProfit: 0,
        largestProfit: 0,
        largestLoss: 0
      });
    }
    
    const winningTrades = trades.filter(trade => trade.profitLoss > 0);
    const losingTrades = trades.filter(trade => trade.profitLoss <= 0);
    
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const averageProfit = totalProfit / trades.length;
    
    const largestProfit = trades.length > 0 
      ? Math.max(...trades.map(trade => trade.profitLoss))
      : 0;
      
    const largestLoss = trades.length > 0 
      ? Math.min(...trades.map(trade => trade.profitLoss))
      : 0;
    
    const stats = {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      totalProfit,
      averageProfit,
      largestProfit,
      largestLoss
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get trade stats error:', error);
    res.status(500).json({ message: 'Server error while fetching trade statistics' });
  }
};
