import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { totalItems } = useCart();

  // Determine if FloatingCartBar is currently visible on screen
  const hideCartRoutes = ['/cart', '/checkout', '/login', '/register'];
  const isCartBarVisible = totalItems > 0 && !hideCartRoutes.includes(pathname);

  // Automatically scroll to the very top whenever the route or search query changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  // Floating button visible when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTopSmooth}
          className={`fixed right-4 sm:right-6 z-40 p-2.5 sm:p-3 rounded-full bg-stone-900/90 hover:bg-rose-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-90 border border-white/20 backdrop-blur-sm cursor-pointer animate-fade-in ${
            isCartBarVisible ? 'bottom-20 sm:bottom-24' : 'bottom-4 sm:bottom-6'
          }`}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
