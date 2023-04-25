export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  off(eventName, callback) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  once(eventName, callback) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      callback(...args);
    };
    this.on(eventName, wrapper);
  }
}
