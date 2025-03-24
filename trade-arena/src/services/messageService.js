import api from './api';

// Message API calls
export const createMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMessages = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/messages?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMessageReplies = async (messageId, page = 1, limit = 20) => {
  try {
    const response = await api.get(`/messages/${messageId}/replies?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const toggleLike = async (messageId) => {
  try {
    const response = await api.put(`/messages/${messageId}/like`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
