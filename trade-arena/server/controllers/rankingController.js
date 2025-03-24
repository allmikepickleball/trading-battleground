const Ranking = require('../models/Ranking');
const Trade = require('../models/Trade');
const User = require('../models/User');

// Calculate and update user rankings
exports.updateRankings = async (req, res) => {
  try {
    // Get all users
    const users = await User.find();
    
    for (const user of users) {
      // Get user's trades
      const trades = await Trade.find({ user: user._id });
      
      if (trades.length === 0) {
        continue; // Skip users with no trades
      }
      
      // Calculate performance metrics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const weeklyTrades = trades.filter(trade => new Date(trade.date) >= oneWeekAgo);
      const monthlyTrades = trades.filter(trade => new Date(trade.date) >= oneMonthAgo);
      
      // Calculate weekly performance
      const weeklyPerformance = calculatePerformance(weeklyTrades);
      
      // Calculate monthly performance
      const monthlyPerformance = calculatePerformance(monthlyTrades);
      
      // Calculate all-time performance
      const allTimePerformance = calculatePerformance(trades);
      
      // Calculate win rate
      const winningTrades = trades.filter(trade => trade.profitLoss > 0);
      const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
      
      // Calculate consistency score (based on streak and win rate)
      const consistencyScore = calculateConsistencyScore(trades);
      
      // Determine rank tier based on weekly performance
      const rankTier = determineRankTier(weeklyPerformance);
      
      // Find or create user ranking
      let ranking = await Ranking.findOne({ user: user._id });
      
      if (!ranking) {
        ranking = new Ranking({
          user: user._id
        });
      }
      
      // Update weeks at Monarch count
      let weeksAtMonarch = ranking.weeksAtMonarch;
      if (rankTier === 'Monarch Trader') {
        weeksAtMonarch += 1;
      } else {
        weeksAtMonarch = 0;
      }
      
      // Check for special rank tiers based on consecutive weeks at Monarch
      let finalRankTier = rankTier;
      if (weeksAtMonarch >= 12) {
        finalRankTier = 'Ascended One';
      } else if (weeksAtMonarch >= 8) {
        finalRankTier = 'Omniscient Oracle';
      } else if (weeksAtMonarch >= 4) {
        finalRankTier = 'Divine Mogul';
      }
      
      // Update ranking
      ranking.weeklyPerformance = weeklyPerformance;
      ranking.monthlyPerformance = monthlyPerformance;
      ranking.allTimePerformance = allTimePerformance;
      ranking.winRate = winRate;
      ranking.consistencyScore = consistencyScore;
      ranking.rankTier = finalRankTier;
      ranking.weeksAtMonarch = weeksAtMonarch;
      ranking.lastUpdated = now;
      
      await ranking.save();
    }
    
    res.json({ message: 'Rankings updated successfully' });
  } catch (error) {
    console.error('Update rankings error:', error);
    res.status(500).json({ message: 'Server error during rankings update' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'all-time';
    
    let sortField;
    switch (timeframe) {
      case 'weekly':
        sortField = 'weeklyPerformance';
        break;
      case 'monthly':
        sortField = 'monthlyPerformance';
        break;
      default:
        sortField = 'allTimePerformance';
    }
    
    const rankings = await Ranking.find()
      .sort({ [sortField]: -1 })
      .populate('user', 'username displayName profilePicture');
    
    const leaderboard = rankings.map((ranking, index) => ({
      rank: index + 1,
      userId: ranking.user._id,
      username: ranking.user.username,
      displayName: ranking.user.displayName,
      profilePicture: ranking.user.profilePicture,
      performance: ranking[sortField],
      winRate: ranking.winRate,
      consistencyScore: ranking.consistencyScore,
      rankTier: ranking.rankTier
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error while fetching leaderboard' });
  }
};

// Get user ranking
exports.getUserRanking = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const ranking = await Ranking.findOne({ user: userId })
      .populate('user', 'username displayName profilePicture');
    
    if (!ranking) {
      return res.status(404).json({ message: 'Ranking not found' });
    }
    
    // Get user's position on leaderboard
    const allRankings = await Ranking.find().sort({ allTimePerformance: -1 });
    const userRank = allRankings.findIndex(r => r.user.toString() === userId) + 1;
    
    const rankingData = {
      rank: userRank,
      userId: ranking.user._id,
      username: ranking.user.username,
      displayName: ranking.user.displayName,
      profilePicture: ranking.user.profilePicture,
      weeklyPerformance: ranking.weeklyPerformance,
      monthlyPerformance: ranking.monthlyPerformance,
      allTimePerformance: ranking.allTimePerformance,
      winRate: ranking.winRate,
      consistencyScore: ranking.consistencyScore,
      rankTier: ranking.rankTier,
      weeksAtMonarch: ranking.weeksAtMonarch
    };
    
    res.json(rankingData);
  } catch (error) {
    console.error('Get user ranking error:', error);
    res.status(500).json({ message: 'Server error while fetching user ranking' });
  }
};

// Get rank tiers
exports.getRankTiers = async (req, res) => {
  try {
    const rankTiers = [
      {
        tier: 'Ascended One',
        icon: '🌌',
        requirement: '12 consecutive weeks at Monarch Trader',
        description: 'A being of pure financial mastery, untouchable in the markets.'
      },
      {
        tier: 'Omniscient Oracle',
        icon: '🔱',
        requirement: '8 consecutive weeks at Monarch Trader',
        description: 'Sees every move before it happens, always ahead of the game.'
      },
      {
        tier: 'Divine Mogul',
        icon: '⚡',
        requirement: '4 consecutive weeks at Monarch Trader',
        description: 'A supreme force in the financial world, unstoppable wealth creator.'
      },
      {
        tier: 'Monarch Trader',
        icon: '👑',
        requirement: '+50% or more weekly performance',
        description: 'A market ruler, dominating with wisdom and strategy.'
      },
      {
        tier: 'Capitalist',
        icon: '💰',
        requirement: '+30% to +49.99% weekly performance',
        description: 'A wealth-building machine, thriving on smart plays.'
      },
      {
        tier: 'Diamond Hands',
        icon: '💎',
        requirement: '+20% to +29.99% weekly performance',
        description: 'Thriving in volatility, fearless and composed.'
      },
      {
        tier: 'Profitable Platinum',
        icon: '📈',
        requirement: '+10% to +19.99% weekly performance',
        description: 'Consistently stacking gains, a strategic player.'
      },
      {
        tier: 'Green Gold',
        icon: '🟢',
        requirement: '+5% to +9.99% weekly performance',
        description: 'Building momentum, trending upward.'
      },
      {
        tier: 'Slipping Silver',
        icon: '⚖️',
        requirement: '0% to +4.99% weekly performance',
        description: 'Surviving but not thriving.'
      },
      {
        tier: 'Beta Hands',
        icon: '🥉',
        requirement: '-1% or worse weekly performance',
        description: 'Playing too safe, losing ground.'
      }
    ];
    
    res.json(rankTiers);
  } catch (error) {
    console.error('Get rank tiers error:', error);
    res.status(500).json({ message: 'Server error while fetching rank tiers' });
  }
};

// Helper functions
const calculatePerformance = (trades) => {
  if (trades.length === 0) return 0;
  
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const totalInvestment = trades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);
  
  return totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
};

const calculateConsistencyScore = (trades) => {
  if (trades.length < 5) return 0;
  
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate current streak
  let currentStreak = 0;
  let maxStreak = 0;
  let previousTradeWasProfit = null;
  
  for (const trade of sortedTrades) {
    const isProfit = trade.profitLoss > 0;
    
    if (previousTradeWasProfit === null) {
      // First trade
      currentStreak = 1;
    } else if (isProfit === previousTradeWasProfit) {
      // Continuing streak
      currentStreak++;
    } else {
      // Streak broken
      currentStreak = 1;
    }
    
    previousTradeWasProfit = isProfit;
    maxStreak = Math.max(maxStreak, currentStreak);
  }
  
  // Calculate win rate
  const winningTrades = trades.filter(trade => trade.profitLoss > 0);
  const winRate = (winningTrades.length / trades.length) * 100;
  
  // Calculate consistency score (weighted combination of win rate and max streak)
  const consistencyScore = (winRate * 0.7) + (maxStreak * 3);
  
  return Math.min(100, consistencyScore); // Cap at 100
};

const determineRankTier = (weeklyPerformance) => {
  if (weeklyPerformance >= 50) return 'Monarch Trader';
  if (weeklyPerformance >= 30) return 'Capitalist';
  if (weeklyPerformance >= 20) return 'Diamond Hands';
  if (weeklyPerformance >= 10) return 'Profitable Platinum';
  if (weeklyPerformance >= 5) return 'Green Gold';
  if (weeklyPerformance >= 0) return 'Slipping Silver';
  return 'Beta Hands';
};
