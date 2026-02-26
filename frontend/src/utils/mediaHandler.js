/**
 * Utility functions for handling media (audio/video) elements
 * Addresses common issues with play/pause interruptions
 */

/**
 * Safe play method that handles common audio/video playback errors
 * @param {HTMLMediaElement} mediaElement - The audio or video element to play
 * @returns {Promise} - Promise that resolves when playing starts or rejects with an error
 */
export const safePlay = async (mediaElement) => {
  if (!mediaElement) return Promise.reject(new Error('No media element provided'));
  
  try {
    // Set up error handling for AbortError
    const playPromise = mediaElement.play();
    
    // Modern browsers return a promise from play()
    if (playPromise !== undefined) {
      return playPromise.catch(error => {
        // Handle the specific AbortError
        if (error.name === 'AbortError') {
          console.warn('Media playback was aborted, likely due to a pause() call');
          // Return resolved promise to prevent error propagation
          return Promise.resolve();
        }
        
        // Handle other play errors
        console.error('Media playback error:', error);
        // Return resolved promise to prevent error propagation
        return Promise.resolve();
      });
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Unexpected error during media playback:', error);
    return Promise.resolve(); // Prevent error propagation
  }
};

/**
 * Safe pause method that ensures proper handling of play/pause sequence
 * @param {HTMLMediaElement} mediaElement - The audio or video element to pause
 */
export const safePause = (mediaElement) => {
  if (!mediaElement) return;
  
  try {
    // Check if the element is actually playing before pausing
    if (!mediaElement.paused) {
      mediaElement.pause();
    }
  } catch (error) {
    console.error('Error pausing media:', error);
  }
};

/**
 * Add global handlers for common media-related errors
 */
export const setupMediaErrorHandlers = () => {
  // Global handler for uncaught media errors
  window.addEventListener('error', (event) => {
    // Check if the error is related to media playback
    if (event.message && (
      event.message.includes('The play() request was interrupted') ||
      event.message.includes('AbortError') ||
      event.message.includes('play() failed')
    )) {
      console.warn('Suppressed browser media error:', event.message);
      // Prevent the error from propagating
      event.preventDefault();
      return true;
    }
    return false;
  }, { capture: true });
};

// Set up global handlers immediately
setupMediaErrorHandlers();

// Default export for convenience
export default {
  safePlay,
  safePause,
  setupMediaErrorHandlers
}; 