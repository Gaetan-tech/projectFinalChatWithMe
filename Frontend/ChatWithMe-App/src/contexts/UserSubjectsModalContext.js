import { createContext, useCallback, useContext, useState } from 'react';

const UserSubjectsModalContext = createContext();

export const UserSubjectsModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const openModal = useCallback((user, userSubjects = []) => {
    setUserData(user);
    setSubjects(userSubjects);
    setIsVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    // Réinitialiser les données après la fermeture
    setTimeout(() => {
      setUserData(null);
      setSubjects([]);
    }, 300);
  }, []);

  const value = {
    isVisible,
    userData,
    subjects,
    openModal,
    closeModal,
  };

  return (
    <UserSubjectsModalContext.Provider value={value}>
      {children}
    </UserSubjectsModalContext.Provider>
  );
};

export const useUserSubjectsModal = () => {
  const context = useContext(UserSubjectsModalContext);
  if (!context) {
    throw new Error('useUserSubjectsModal must be used within UserSubjectsModalProvider');
  }
  return context;
};
