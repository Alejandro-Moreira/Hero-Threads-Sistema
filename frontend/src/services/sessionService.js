// Session management service for automatic timeout and activity tracking
import apiService from './apiService.js';

class SessionService {
  constructor() {
    this.timeoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.timeoutId = null;
    this.activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    this.onTimeout = null;
  }

  // Initialize session tracking
  init(onTimeoutCallback) {
    this.onTimeout = onTimeoutCallback;
    this.resetTimer();
    this.setupActivityListeners();
  }

  // Setup activity event listeners
  setupActivityListeners() {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true);
    });
  }

  // Reset the timeout timer
  resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      if (this.onTimeout) {
        this.onTimeout('Session expired due to inactivity');
      }
    }, this.timeoutDuration);
  }

  // Update user activity on the backend
  async updateActivity(userId) {
    try {
      if (!userId) return;
      
      await apiService.updateActivity(userId);
      this.resetTimer();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  // Clear session tracking
  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, () => this.resetTimer(), true);
    });
  }

  // Get remaining time in minutes
  getRemainingTime() {
    // This would calculate remaining time based on last activity
    // For now, return a placeholder
    return 15;
  }
}

export default new SessionService(); 