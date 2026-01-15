import '@testing-library/jest-dom/vitest';

// JSDOM lacks a few browser APIs that the app relies on.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error - polyfill for tests
globalThis.ResizeObserver = globalThis.ResizeObserver || NoopObserver;
// @ts-expect-error - polyfill for tests
globalThis.IntersectionObserver = globalThis.IntersectionObserver || NoopObserver;

if (!globalThis.URL.createObjectURL) {
  // @ts-expect-error - polyfill for tests
  globalThis.URL.createObjectURL = () => 'blob:vitest-mock';
}

if (!globalThis.URL.revokeObjectURL) {
  // @ts-expect-error - polyfill for tests
  globalThis.URL.revokeObjectURL = () => {};
}
