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
      // Need to iterate over a copy of the callbacks array because
      // some callbacks will de-register themselves when they are called,
      // which will modify the original array.
      callbacks.slice().forEach(callback => callback(...args));
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
