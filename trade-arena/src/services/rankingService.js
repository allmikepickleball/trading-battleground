import api from './api';

// Ranking API calls
export const getLeaderboard = async (timeframe = 'all-time') => {
  try {
    const response = await api.get(`/rankings/leaderboard?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserRanking = async () => {
  try {
    const response = await api.get('/rankings/user');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRankTiers = async () => {
  try {
    const response = await api.get('/rankings/tiers');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateRankings = async () => {
  try {
    const response = await api.post('/rankings/update');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
