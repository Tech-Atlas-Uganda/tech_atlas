import { useEffect, useState } from 'react';

interface UseCounterOptions {
  end: number;
  duration?: number;
  start?: number;
  enabled?: boolean;
}

export function useCounter({ 
  end, 
  duration = 2000, 
  start = 0,
  enabled = true 
}: UseCounterOptions) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!enabled) return;

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(start + (end - start) * easeProgress);
      setCount(currentCount);
      
      if (now >= endTime) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [end, duration, start, enabled]);

  return count;
}
