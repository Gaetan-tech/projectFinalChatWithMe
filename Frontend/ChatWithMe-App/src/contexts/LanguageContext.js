import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Valeur par défaut sûre pour éviter undefined
  const getDefaultLanguage = () => {
    try {
      const locale = Localization.locale || Localization.getLocales()?.[0]?.languageCode || 'fr';
      return locale.split('-')[0];
    } catch (error) {
      console.log('Erreur détection langue:', error);
      return 'fr'; // Français par défaut
    }
  };
  
  const [language, setLanguage] = useState(getDefaultLanguage());

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        // Utiliser la langue du système avec protection
        const systemLang = getDefaultLanguage();
        setLanguage(systemLang);
        i18n.changeLanguage(systemLang);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la langue:', error);
      // En cas d'erreur, utiliser français par défaut
      setLanguage('fr');
      i18n.changeLanguage('fr');
    }
  };

  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      i18n.changeLanguage(lang);
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  const t = (key, options) => i18n.t(key, options);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};