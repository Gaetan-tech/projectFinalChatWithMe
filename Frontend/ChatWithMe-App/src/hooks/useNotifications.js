// src/hooks/useLocation.js
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export const useLocation = (enabled = false) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Réinitialiser l'erreur
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission refusée');
        setLoading(false);
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Ajout de l'accuracy pour de meilleures performances
      });
      
      setLocation(loc);
      setLoading(false);
      return loc;
    } catch (err) {
      console.error('Erreur lors de la récupération de la localisation:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      requestLocation();
    }
  }, [enabled, requestLocation]); // Ajout de requestLocation dans les dépendances

  return { location, loading, error, requestLocation };
};