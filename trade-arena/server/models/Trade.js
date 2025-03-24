const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tradeType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  assetType: {
    type: String,
    enum: ['Stocks', 'Crypto', 'Forex', 'Options', 'Futures'],
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  stopLoss: {
    type: Number
  },
  takeProfit: {
    type: Number
  },
  leverage: {
    type: Number,
    default: 1
  },
  profitLoss: {
    type: Number,
    required: true
  },
  profitLossPercentage: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate profit/loss before saving
TradeSchema.pre('save', function(next) {
  // Calculate profit/loss
  const totalInvestment = this.entryPrice * this.quantity;
  const totalReturn = this.exitPrice * this.quantity;
  
  if (this.tradeType === 'BUY') {
    this.profitLoss = (totalReturn - totalInvestment) * this.leverage;
    this.profitLossPercentage = ((this.exitPrice - this.entryPrice) / this.entryPrice) * 100 * this.leverage;
  } else {
    // For SELL (short) trades, profit is reversed
    this.profitLoss = (totalInvestment - totalReturn) * this.leverage;
    this.profitLossPercentage = ((this.entryPrice - this.exitPrice) / this.entryPrice) * 100 * this.leverage;
  }
  
  next();
});

module.exports = mongoose.model('Trade', TradeSchema);
