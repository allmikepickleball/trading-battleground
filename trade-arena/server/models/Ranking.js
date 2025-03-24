const mongoose = require('mongoose');

const RankingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weeklyPerformance: {
    type: Number,
    default: 0
  },
  monthlyPerformance: {
    type: Number,
    default: 0
  },
  allTimePerformance: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  consistencyScore: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  rankTier: {
    type: String,
    enum: [
      'Beta Hands',
      'Slipping Silver',
      'Green Gold',
      'Profitable Platinum',
      'Diamond Hands',
      'Capitalist',
      'Monarch Trader',
      'Divine Mogul',
      'Omniscient Oracle',
      'Ascended One'
    ],
    default: 'Beta Hands'
  },
  weeksAtMonarch: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ranking', RankingSchema);
