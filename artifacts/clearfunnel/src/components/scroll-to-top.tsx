import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop — scrolls the window to the top on every route change.
 * Renders nothing; place it inside the Router so it responds to location changes.
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Use instant scroll so Lenis (if active) doesn't animate on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);

  return null;
}
