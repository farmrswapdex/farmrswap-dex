import { useState, useEffect } from 'react';

const useIsMobile = (query: string = '(max-width: 768px)') => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleResize = () => setIsMobile(mediaQuery.matches);

        // Initial check
        handleResize();

        // Listen for changes
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, [query]);

    return isMobile;
};

export default useIsMobile;
