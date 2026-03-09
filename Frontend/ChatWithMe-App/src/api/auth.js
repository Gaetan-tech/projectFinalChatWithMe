import apiClient from './client';

export const authAPI = {
  // Inscription
  register: (username, email, password) => {
    console.log('📤 API Register:', { username, email });
    return apiClient.post('/auth/register', {
      username,
      email,
      password,
    });
  },

  // Connexion
  login: (email, password) => {
    console.log('📤 API Login:', { email });
    return apiClient.post('/auth/login', {
      email,
      password,
    });
  },

  // Déconnexion
  logout: () => {
    return apiClient.post('/auth/logout');
  },
};