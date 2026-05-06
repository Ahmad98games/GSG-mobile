import { useEffect, useRef } from 'react';

/**
 * SOVEREIGN USEINTERVAL HOOK (v2.0)
 * High-performance, React-safe interval mechanism for industrial telemetry.
 */

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
