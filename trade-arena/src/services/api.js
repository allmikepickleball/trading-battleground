// Update API service imports to use mock service for static deployment
import mockApiService from './mockApiService';

// Export the appropriate service based on environment
const api = mockApiService;

export default api;
