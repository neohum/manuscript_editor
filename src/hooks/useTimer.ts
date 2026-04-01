import { useState, useEffect, useRef } from 'react';

export function useTimer() {
  const [durationSec, setDurationSec] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const stop = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsActive(false);
    setDurationSec(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setDurationSec(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return { durationSec, start, stop, reset, isActive };
}
