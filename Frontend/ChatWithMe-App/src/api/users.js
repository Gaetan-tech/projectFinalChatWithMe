import apiClient from './client';

export const usersAPI = {
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  changeFlagStatus: (flagStatus) => {
    return apiClient.put('/users/flag-status', { flagStatus });
  },

  getGreenFlagUsers: () => {
    return apiClient.get('/users/green-flags');
  },

  getRedFlagUsers: () => {
    return apiClient.get('/users/red-flags');
  },

  getOnlineUsers: () => {
    return apiClient.get('/users/online');
  },
};