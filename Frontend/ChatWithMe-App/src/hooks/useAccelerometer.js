import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

export const useAccelerometer = (onShake) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      
      // Détection de shake
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      
      if (acceleration > 2.5) {
        setIsShaking(true);
        onShake?.();
        
        setTimeout(() => setIsShaking(false), 1000);
      }
    });

    return () => subscription.remove();
  }, [onShake]);

  return { data, isShaking };
};