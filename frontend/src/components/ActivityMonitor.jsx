import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// ActivityMonitor listens for user interactions to reset the session timer
const ActivityMonitor = () => {
  const { resetSessionTimer } = useAuth();

  useEffect(() => {
    // List of events to monitor for user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    // Debounce function to limit the frequency of session timer resets
    const debounce = (func, delay) => {
      let debounceTimer;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      };
    };

    // Create a debounced version of resetSessionTimer to avoid excessive calls
    const debouncedResetSession = debounce(() => {
      resetSessionTimer();
    }, 1000); // Reset session timer at most once per second

    // Add event listeners for all activity events
    activityEvents.forEach(event => {
      window.addEventListener(event, debouncedResetSession);
    });

    // Clean up event listeners on unmount
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, debouncedResetSession);
      });
    };
  }, [resetSessionTimer]);

  // This component doesn't render anything
  return null;
};

export default ActivityMonitor; 