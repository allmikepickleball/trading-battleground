import api from './api';

// Stock API calls
export const getStockData = async (symbol, interval = '1d', range = '1mo') => {
  try {
    const response = await api.get(`/stocks/${symbol}?interval=${interval}&range=${range}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await api.get(`/stocks/search/${query}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPopularStocks = async () => {
  try {
    const response = await api.get('/stocks/popular');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
