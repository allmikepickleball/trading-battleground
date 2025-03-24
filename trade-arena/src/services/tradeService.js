import api from './api';

// Trade API calls
export const createTrade = async (tradeData) => {
  try {
    const response = await api.post('/trades', tradeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserTrades = async () => {
  try {
    const response = await api.get('/trades');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTradeById = async (tradeId) => {
  try {
    const response = await api.get(`/trades/${tradeId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTrade = async (tradeId, tradeData) => {
  try {
    const response = await api.put(`/trades/${tradeId}`, tradeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTrade = async (tradeId) => {
  try {
    const response = await api.delete(`/trades/${tradeId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTradeStats = async () => {
  try {
    const response = await api.get('/trades/stats/summary');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
