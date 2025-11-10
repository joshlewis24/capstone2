import { useState, useEffect } from 'react';

// Responsive hook to detect if viewport is desktop size (default >= 1024px)
export const useIsDesktop = (breakpoint: number = 1024): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safeguard

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop('matches' in e ? e.matches : (e as MediaQueryList).matches);
    };

    // Set initial state
    handleChange(mediaQuery);

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange as EventListener);
    } else {
      // Safari fallback
      // @ts-ignore
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange as EventListener);
      } else {
        // @ts-ignore
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [breakpoint]);

  return isDesktop;
};

export default useIsDesktop;