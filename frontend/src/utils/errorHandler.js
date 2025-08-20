// Error handler utility for DOM operations
export const safeDOMOperation = (operation, fallback = null) => {
  try {
    return operation();
  } catch (error) {
    console.warn('DOM operation failed:', error.message);
    return fallback;
  }
};

// Safe element selector with null check
export const safeGetElement = (selector, context = document) => {
  try {
    const element = context.querySelector(selector);
    return element || null;
  } catch (error) {
    console.warn(`Failed to get element with selector: ${selector}`, error.message);
    return null;
  }
};

// Safe event listener addition
export const safeAddEventListener = (element, event, handler, options) => {
  if (!element) {
    console.warn('Cannot add event listener: element is null');
    return false;
  }
  
  try {
    element.addEventListener(event, handler, options);
    return true;
  } catch (error) {
    console.warn('Failed to add event listener:', error.message);
    return false;
  }
};

// Optimized error handler for DOM operations
export const setupGlobalErrorHandler = () => {
  // Override DOM methods immediately to prevent errors
  const originalQuerySelector = document.querySelector;
  const originalGetElementById = document.getElementById;
  const originalAddEventListener = Element.prototype.addEventListener;

  // Safe querySelector
  document.querySelector = function(selector) {
    try {
      const element = originalQuerySelector.call(this, selector);
      if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
      }
      return element;
    } catch (error) {
      console.warn(`QuerySelector error for ${selector}:`, error.message);
      return null;
    }
  };

  // Safe getElementById
  document.getElementById = function(id) {
    try {
      const element = originalGetElementById.call(this, id);
      if (!element) {
        console.warn(`Element with ID '${id}' not found`);
        return null;
      }
      return element;
    } catch (error) {
      console.warn(`GetElementById error for ${id}:`, error.message);
      return null;
    }
  };

  // Safe addEventListener
  Element.prototype.addEventListener = function(type, listener, options) {
    try {
      if (this && typeof this.addEventListener === 'function') {
        return originalAddEventListener.call(this, type, listener, options);
      } else {
        console.warn('Cannot add event listener: element is invalid');
        return false;
      }
    } catch (error) {
      console.warn('Failed to add event listener:', error.message);
      return false;
    }
  };

  // Global error suppression for external scripts
  window.addEventListener('error', (event) => {
    // Suppress all external script errors
    if (event.filename && (
      event.filename.includes('share-modal.js') ||
      event.filename.includes('sharebx.js') ||
      event.filename.includes('css.js') ||
      event.filename.includes('chrome-extension') ||
      event.filename.includes('moz-extension') ||
      event.filename.includes('safari-extension') ||
      event.filename.includes('edge-extension') ||
      event.filename.includes('external') ||
      event.filename.includes('third-party') ||
      event.filename.includes('vercel.app') === false // Only allow your app errors
    )) {
      event.preventDefault();
      console.warn('External script error suppressed:', event.message);
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
}; 