// Mock API service for static deployment
// This file simulates backend API responses for the static website version

class MockApiService {
  constructor() {
    // Initialize local storage if not exists
    if (!localStorage.getItem('tradeArenaUsers')) {
      localStorage.setItem('tradeArenaUsers', JSON.stringify([]));
    }
    if (!localStorage.getItem('tradeArenaTrades')) {
      localStorage.setItem('tradeArenaTrades', JSON.stringify([]));
    }
    if (!localStorage.getItem('tradeArenaMessages')) {
      localStorage.setItem('tradeArenaMessages', JSON.stringify([]));
    }
    if (!localStorage.getItem('tradeArenaJournalEntries')) {
      localStorage.setItem('tradeArenaJournalEntries', JSON.stringify([]));
    }
    if (!localStorage.getItem('tradeArenaRankings')) {
      localStorage.setItem('tradeArenaRankings', JSON.stringify([]));
    }
  }

  // Authentication methods
  async register(userData) {
    const users = JSON.parse(localStorage.getItem('tradeArenaUsers'));
    
    // Check if username already exists
    if (users.find(user => user.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      displayName: userData.displayName,
      password: userData.password, // In a real app, this would be hashed
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('tradeArenaUsers', JSON.stringify(users));
    
    // Create initial ranking for user
    this.createInitialRanking(newUser.id);
    
    return { success: true, message: 'Registration successful' };
  }
  
  async login(credentials) {
    const users = JSON.parse(localStorage.getItem('tradeArenaUsers'));
    
    // Find user
    const user = users.find(user => 
      user.username === credentials.username && 
      user.password === credentials.password
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Create token (simulated)
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Store in localStorage for session management
    localStorage.setItem('tradeArenaToken', token);
    localStorage.setItem('tradeArenaCurrentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      isAdmin: user.isAdmin
    }));
    
    return { 
      success: true, 
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        isAdmin: user.isAdmin
      }
    };
  }
  
  async logout() {
    localStorage.removeItem('tradeArenaToken');
    localStorage.removeItem('tradeArenaCurrentUser');
    return { success: true };
  }
  
  async getCurrentUser() {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    return { 
      success: true, 
      user: JSON.parse(userJson)
    };
  }
  
  // Trade methods
  async createTrade(tradeData) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const trades = JSON.parse(localStorage.getItem('tradeArenaTrades'));
    
    // Calculate profit/loss
    const entryTotal = tradeData.entryPrice * tradeData.quantity;
    const exitTotal = tradeData.exitPrice * tradeData.quantity;
    const profitLoss = tradeData.tradeType === 'buy' 
      ? exitTotal - entryTotal 
      : entryTotal - exitTotal;
    
    // Create new trade
    const newTrade = {
      id: Date.now().toString(),
      userId: user.id,
      ...tradeData,
      profitLoss,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    trades.push(newTrade);
    localStorage.setItem('tradeArenaTrades', JSON.stringify(trades));
    
    // Update user ranking
    this.updateRanking(user.id);
    
    return { success: true, trade: newTrade };
  }
  
  async getUserTrades() {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const trades = JSON.parse(localStorage.getItem('tradeArenaTrades'));
    
    // Filter trades by user
    const userTrades = trades.filter(trade => trade.userId === user.id);
    
    return { success: true, trades: userTrades };
  }
  
  async updateTrade(tradeId, tradeData) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const trades = JSON.parse(localStorage.getItem('tradeArenaTrades'));
    
    // Find trade index
    const tradeIndex = trades.findIndex(trade => 
      trade.id === tradeId && trade.userId === user.id
    );
    
    if (tradeIndex === -1) {
      return { success: false, message: 'Trade not found or not authorized' };
    }
    
    // Calculate profit/loss
    const entryTotal = tradeData.entryPrice * tradeData.quantity;
    const exitTotal = tradeData.exitPrice * tradeData.quantity;
    const profitLoss = tradeData.tradeType === 'buy' 
      ? exitTotal - entryTotal 
      : entryTotal - exitTotal;
    
    // Update trade
    trades[tradeIndex] = {
      ...trades[tradeIndex],
      ...tradeData,
      profitLoss,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('tradeArenaTrades', JSON.stringify(trades));
    
    // Update user ranking
    this.updateRanking(user.id);
    
    return { success: true, trade: trades[tradeIndex] };
  }
  
  async deleteTrade(tradeId) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const trades = JSON.parse(localStorage.getItem('tradeArenaTrades'));
    
    // Filter out the trade
    const updatedTrades = trades.filter(trade => 
      !(trade.id === tradeId && trade.userId === user.id)
    );
    
    if (updatedTrades.length === trades.length) {
      return { success: false, message: 'Trade not found or not authorized' };
    }
    
    localStorage.setItem('tradeArenaTrades', JSON.stringify(updatedTrades));
    
    // Update user ranking
    this.updateRanking(user.id);
    
    return { success: true };
  }
  
  // Ranking methods
  createInitialRanking(userId) {
    const rankings = JSON.parse(localStorage.getItem('tradeArenaRankings'));
    
    // Create initial ranking
    const newRanking = {
      id: Date.now().toString(),
      userId,
      totalProfitLoss: 0,
      weeklyProfitLoss: 0,
      monthlyProfitLoss: 0,
      winRate: 0,
      consistencyScore: 0,
      rank: 'Beta Hands', // Lowest rank
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    rankings.push(newRanking);
    localStorage.setItem('tradeArenaRankings', JSON.stringify(rankings));
  }
  
  updateRanking(userId) {
    const trades = JSON.parse(localStorage.getItem('tradeArenaTrades'));
    const rankings = JSON.parse(localStorage.getItem('tradeArenaRankings'));
    
    // Filter trades by user
    const userTrades = trades.filter(trade => trade.userId === userId);
    
    if (userTrades.length === 0) {
      return;
    }
    
    // Calculate metrics
    const totalProfitLoss = userTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    
    // Calculate weekly profit/loss
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyTrades = userTrades.filter(trade => 
      new Date(trade.createdAt) >= oneWeekAgo
    );
    const weeklyProfitLoss = weeklyTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    
    // Calculate monthly profit/loss
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthlyTrades = userTrades.filter(trade => 
      new Date(trade.createdAt) >= oneMonthAgo
    );
    const monthlyProfitLoss = monthlyTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    
    // Calculate win rate
    const winningTrades = userTrades.filter(trade => trade.profitLoss > 0);
    const winRate = userTrades.length > 0 ? (winningTrades.length / userTrades.length) * 100 : 0;
    
    // Calculate consistency score (simplified)
    let consistencyScore = 0;
    if (userTrades.length >= 10) {
      consistencyScore = winRate > 50 ? 70 : 30;
      if (totalProfitLoss > 1000) consistencyScore += 15;
      if (winRate > 60) consistencyScore += 15;
    }
    
    // Determine rank
    let rank = 'Beta Hands';
    if (totalProfitLoss > 10000 && winRate > 65 && consistencyScore > 90) {
      rank = 'Ascended One';
    } else if (totalProfitLoss > 5000 && winRate > 60 && consistencyScore > 80) {
      rank = 'Monarch';
    } else if (totalProfitLoss > 2500 && winRate > 55 && consistencyScore > 70) {
      rank = 'Apex Predator';
    } else if (totalProfitLoss > 1000 && winRate > 50 && consistencyScore > 60) {
      rank = 'Elite Trader';
    } else if (totalProfitLoss > 500 && winRate > 45) {
      rank = 'Veteran';
    } else if (totalProfitLoss > 250) {
      rank = 'Journeyman';
    } else if (totalProfitLoss > 100) {
      rank = 'Apprentice';
    } else if (totalProfitLoss > 0) {
      rank = 'Novice';
    } else if (totalProfitLoss < 0) {
      rank = 'Beta Hands';
    }
    
    // Find ranking index
    const rankingIndex = rankings.findIndex(ranking => ranking.userId === userId);
    
    if (rankingIndex === -1) {
      // Create new ranking if not found
      this.createInitialRanking(userId);
      return;
    }
    
    // Update ranking
    rankings[rankingIndex] = {
      ...rankings[rankingIndex],
      totalProfitLoss,
      weeklyProfitLoss,
      monthlyProfitLoss,
      winRate,
      consistencyScore,
      rank,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('tradeArenaRankings', JSON.stringify(rankings));
  }
  
  async getLeaderboard(timeframe = 'all-time') {
    const rankings = JSON.parse(localStorage.getItem('tradeArenaRankings'));
    const users = JSON.parse(localStorage.getItem('tradeArenaUsers'));
    
    // Sort rankings based on timeframe
    let sortedRankings;
    if (timeframe === 'weekly') {
      sortedRankings = [...rankings].sort((a, b) => b.weeklyProfitLoss - a.weeklyProfitLoss);
    } else if (timeframe === 'monthly') {
      sortedRankings = [...rankings].sort((a, b) => b.monthlyProfitLoss - a.monthlyProfitLoss);
    } else {
      sortedRankings = [...rankings].sort((a, b) => b.totalProfitLoss - a.totalProfitLoss);
    }
    
    // Add user info to rankings
    const leaderboard = sortedRankings.map(ranking => {
      const user = users.find(user => user.id === ranking.userId);
      return {
        ...ranking,
        username: user ? user.username : 'Unknown',
        displayName: user ? user.displayName : 'Unknown User'
      };
    });
    
    return { success: true, leaderboard };
  }
  
  async getUserRanking() {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const rankings = JSON.parse(localStorage.getItem('tradeArenaRankings'));
    
    // Find user ranking
    const ranking = rankings.find(ranking => ranking.userId === user.id);
    
    if (!ranking) {
      return { success: false, message: 'Ranking not found' };
    }
    
    return { success: true, ranking };
  }
  
  // Message board methods
  async createMessage(messageData) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const messages = JSON.parse(localStorage.getItem('tradeArenaMessages'));
    
    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      content: messageData.content,
      parentId: messageData.parentId || null,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    localStorage.setItem('tradeArenaMessages', JSON.stringify(messages));
    
    return { success: true, message: newMessage };
  }
  
  async getMessages() {
    const messages = JSON.parse(localStorage.getItem('tradeArenaMessages'));
    
    // Sort messages by date (newest first)
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    return { success: true, messages: sortedMessages };
  }
  
  async likeMessage(messageId) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const messages = JSON.parse(localStorage.getItem('tradeArenaMessages'));
    
    // Find message index
    const messageIndex = messages.findIndex(message => message.id === messageId);
    
    if (messageIndex === -1) {
      return { success: false, message: 'Message not found' };
    }
    
    // Check if user already liked the message
    if (messages[messageIndex].likedBy.includes(user.id)) {
      // Unlike
      messages[messageIndex].likes--;
      messages[messageIndex].likedBy = messages[messageIndex].likedBy.filter(id => id !== user.id);
    } else {
      // Like
      messages[messageIndex].likes++;
      messages[messageIndex].likedBy.push(user.id);
    }
    
    localStorage.setItem('tradeArenaMessages', JSON.stringify(messages));
    
    return { success: true, message: messages[messageIndex] };
  }
  
  async deleteMessage(messageId) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const messages = JSON.parse(localStorage.getItem('tradeArenaMessages'));
    
    // Find message
    const message = messages.find(message => message.id === messageId);
    
    if (!message) {
      return { success: false, message: 'Message not found' };
    }
    
    // Check if user is the author or an admin
    if (message.userId !== user.id && !user.isAdmin) {
      return { success: false, message: 'Not authorized' };
    }
    
    // Filter out the message and its replies
    const updatedMessages = messages.filter(msg => 
      msg.id !== messageId && msg.parentId !== messageId
    );
    
    localStorage.setItem('tradeArenaMessages', JSON.stringify(updatedMessages));
    
    return { success: true };
  }
  
  // Journal methods
  async createJournalEntry(entryData) {
    const userJson = localStorage.getItem('tradeArenaCurrentUser');
    if (!userJson) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const user = JSON.parse(userJson);
    const entries = JSON.parse(localStorage.getItem('tradeArenaJournalEntries'));
    
    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      userId: user.id,
      date: entryData.date || new Date().toISOString(),
      content: entryData.content,
      isPublic: entryData.isPublic || false,
      screenshots: entryData.screenshots || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    entries.push(newEntry);
    localStorage.setItem('tradeArenaJournalEntries', JSON<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>