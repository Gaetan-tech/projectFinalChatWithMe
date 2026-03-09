import apiClient from './client';

export const messagesAPI = {
  sendMessage: (subjectId, content) => {
    return apiClient.post('/messages', { subjectId, content });
  },

  getMessages: (subjectId, limit = 50, skip = 0) => {
    return apiClient.get(`/messages/subject/${subjectId}`, {
      params: { limit, skip }
    });
  },

  markAsRead: (subjectId) => {
    return apiClient.put(`/messages/subject/${subjectId}/read`);
  },
};