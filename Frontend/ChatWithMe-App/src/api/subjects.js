import apiClient from './client';

export const subjectsAPI = {
  createSubject: (title, description) => {
    return apiClient.post('/subjects', { title, description });
  },

  getActiveSubjects: () => {
    return apiClient.get('/subjects/active');
  },

  getMySubjects: () => {
    return apiClient.get('/subjects/my-subjects');
  },

  getSubjectById: (subjectId) => {
    return apiClient.get(`/subjects/${subjectId}`);
  },

  joinSubject: (subjectId) => {
    return apiClient.post(`/subjects/${subjectId}/join`);
  },

  closeSubject: (subjectId) => {
    return apiClient.put(`/subjects/${subjectId}/close`);
  },

  updateSubject: (subjectId, title, description) => {
    return apiClient.put(`/subjects/${subjectId}`, { title, description });
  },

  getUserSubjects: (userId) => {
    return apiClient.get(`/subjects/user/${userId}`);
  },
};