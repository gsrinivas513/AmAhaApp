/**
 * useServiceWorker - Register and manage service worker
 */

import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState(null);

  useEffect(() => {
    // Register service worker in production
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          setSwRegistration(registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('✅ Online');
      setIsOnline(true);
      // Trigger sync when coming back online
      if (swRegistration) {
        swRegistration.sync.register('sync-analytics').catch((error) => {
          console.warn('Background sync failed:', error);
        });
      }
    };

    const handleOffline = () => {
      console.log('❌ Offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [swRegistration]);

  return {
    isOnline,
    swRegistration,
    isSupported: 'serviceWorker' in navigator,
  };
}

export default useServiceWorker;
