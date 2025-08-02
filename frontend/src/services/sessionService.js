import apiService from './apiService.js';

class SessionService {
  constructor() {
    this.timeoutDuration = 15 * 60 * 1000; 
    this.timeoutId = null;
    this.activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    this.onTimeout = null;
  }

  init(onTimeoutCallback) {
    this.onTimeout = onTimeoutCallback;
    this.resetTimer();
    this.setupActivityListeners();
  }

  setupActivityListeners() {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true);
    });
  }

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

  async updateActivity(userId) {
    try {
      if (!userId) return;
      
      await apiService.updateActivity(userId);
      this.resetTimer();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, () => this.resetTimer(), true);
    });
  }

  getRemainingTime() {
    return 15;
  }
}

export default new SessionService(); 