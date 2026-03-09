import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur chargement auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('📝 Inscription...', { username, email });
      
      const response = await authAPI.register(username, email, password);
      
      console.log('✅ Réponse inscription:', response.data);

      const { token: newToken, user: newUser } = response.data;

      // Sauvegarder
      await SecureStore.setItemAsync('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      console.error('Détails:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur lors de l\'inscription',
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Connexion...', { email });
      
      const response = await authAPI.login(email, password);
      
      console.log('✅ Réponse connexion:', response.data);

      const { token: newToken, user: newUser } = response.data;

      // Sauvegarder
      await SecureStore.setItemAsync('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      console.error('Détails:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur lors de la connexion',
      };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('user');

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return { success: false };
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erreur mise à jour user:', error);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export par défaut pour compatibilité
export default { AuthProvider, useAuth };