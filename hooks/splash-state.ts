import { useEffect, useState } from 'react';

export function useSplashState(minDisplayTime: number = 3000) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTime);
    
    return () => clearTimeout(timer);
  }, [minDisplayTime]);
  
  return isVisible;
}