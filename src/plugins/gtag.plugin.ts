export function trackUserInteractions() {
    // listen all event
    document.addEventListener('click', handleInteraction);
    document.addEventListener('change', handleInteraction);  // form input change
    document.addEventListener('input', handleInteraction);  //  intput
    document.addEventListener('submit', handleInteraction);  // form submit
  
    function handleInteraction(event) {
      const target = event.target.closest('[data-track-label]');
      // console.log(`1111111111111----------event :`, event);
      // console.log(`2222222222222----------target :`, target);
      if (!target) {
        return;
      }
  
      const eventType = event.type;
      const label =  target.dataset.trackLabel;
      const eventCategory = 'user-interaction';
  
      if (['click', 'change', 'input', 'submit'].includes(eventType)) {
        if (window.gtag) {
          gtag('event', eventType, {
            event_category: eventCategory,
            event_label: label,
            value: target.value || undefined,
          });
          console.log(`gtagevent----------eventType : ${eventType}, label: ${label}`);
        }
      }
    }
  }
  