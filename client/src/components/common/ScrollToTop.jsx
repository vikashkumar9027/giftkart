import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

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
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 p-3 rounded-full bg-stone-900/90 hover:bg-rose-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-90 border border-white/20 backdrop-blur-sm cursor-pointer animate-fade-in"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
