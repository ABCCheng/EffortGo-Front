// src/utils/swupdate.ts

export const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            registration.waiting.postMessage({ action: 'skipWaiting' });
          } 
        }
      } catch (error) {
      }
    }
  };
  