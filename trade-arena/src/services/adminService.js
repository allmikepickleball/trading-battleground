import api from './api';

// Admin API calls
export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const adjustRanking = async (userId, rankingData) => {
  try {
    const response = await api.put(`/admin/rankings/${userId}`, rankingData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/admin/register', adminData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
