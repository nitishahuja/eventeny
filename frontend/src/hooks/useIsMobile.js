import { useState, useEffect } from 'react';

const DEFAULT_MOBILE_BREAKPOINT = 767;

function useIsMobile(maxWidth = DEFAULT_MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${maxWidth}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [maxWidth]);

  return isMobile;
}

export default useIsMobile;

