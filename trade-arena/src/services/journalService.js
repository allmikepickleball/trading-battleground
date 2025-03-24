import api from './api';

// Journal API calls
export const createJournalEntry = async (entryData) => {
  try {
    const response = await api.post('/journal', entryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserJournalEntries = async () => {
  try {
    const response = await api.get('/journal');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getJournalEntryById = async (entryId) => {
  try {
    const response = await api.get(`/journal/${entryId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getJournalEntriesByDate = async (year, month) => {
  try {
    const response = await api.get(`/journal/date/${year}/${month}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateJournalEntry = async (entryId, entryData) => {
  try {
    const response = await api.put(`/journal/${entryId}`, entryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteJournalEntry = async (entryId) => {
  try {
    const response = await api.delete(`/journal/${entryId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPublicJournalEntries = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/journal/public?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
