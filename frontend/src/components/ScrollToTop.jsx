import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts the current URL path
  const { pathname } = useLocation();

  // Every time the pathname changes, fire this effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything visually
  return null;
};

export default ScrollToTop;