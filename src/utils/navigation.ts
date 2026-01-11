// src/utils/navigation.ts
// Simple navigation event emitter for state-based routing

type NavigationCallback = (page: string) => void;

class NavigationManager {
  private listeners: NavigationCallback[] = [];

  subscribe(callback: NavigationCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  navigate(page: string) {
    this.listeners.forEach(listener => listener(page));
  }
}

export const navigationManager = new NavigationManager();
