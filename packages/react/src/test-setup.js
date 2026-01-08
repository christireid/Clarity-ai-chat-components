/**
 * Test Setup for Clarity Chat React Components
 * Fixes memory issues and provides proper test environment configuration
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi, afterEach } from 'vitest';
// Guard for DOM environment
const hasWindow = typeof window !== 'undefined';
const hasDocument = typeof document !== 'undefined';
// Mock window.matchMedia for responsive components
if (hasWindow) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}
// Mock IntersectionObserver for lazy loading components
class MockIntersectionObserver {
    callback;
    elements = [];
    root = null;
    rootMargin = '0px';
    thresholds = [0];
    constructor(callback) {
        this.callback = callback;
    }
    observe(element) {
        this.elements.push(element);
        // Immediately trigger intersection for testing
        this.callback([
            {
                target: element,
                isIntersecting: true,
                intersectionRatio: 1,
                boundingClientRect: element.getBoundingClientRect(),
                intersectionRect: element.getBoundingClientRect(),
                rootBounds: null,
                time: Date.now(),
            },
        ], this);
    }
    unobserve(element) {
        this.elements = this.elements.filter((el) => el !== element);
    }
    disconnect() {
        this.elements = [];
    }
    takeRecords() {
        return [];
    }
}
if (hasWindow) {
    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        value: MockIntersectionObserver,
    });
}
// Also set on global for environments that use global
global.IntersectionObserver = MockIntersectionObserver;
// Mock ResizeObserver for responsive components
class MockResizeObserver {
    callback;
    constructor(callback) {
        this.callback = callback;
    }
    observe() {
        // Mock implementation
    }
    unobserve() {
        // Mock implementation
    }
    disconnect() {
        // Mock implementation
    }
}
global.ResizeObserver = MockResizeObserver;
// Mock WebSocket for real-time features
class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    readyState = 0;
    CONNECTING = 0;
    OPEN = 1;
    CLOSING = 2;
    CLOSED = 3;
    url = '';
    binaryType = 'blob';
    bufferedAmount = 0;
    extensions = '';
    protocol = '';
    onopen = null;
    onclose = null;
    onerror = null;
    onmessage = null;
    constructor(url) {
        this.url = url;
        setTimeout(() => {
            this.readyState = 1; // OPEN
            if (this.onopen)
                this.onopen(new Event('open'));
        }, 0);
    }
    send() { }
    close() {
        this.readyState = 3; // CLOSED
        if (this.onclose)
            this.onclose(new CloseEvent('close'));
    }
    addEventListener() { }
    removeEventListener() { }
    dispatchEvent() {
        return true;
    }
}
global.WebSocket = MockWebSocket;
// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn(function (key) {
        return this.store[key] || null;
    }),
    setItem: vi.fn(function (key, value) {
        this.store[key] = value;
    }),
    removeItem: vi.fn(function (key) {
        delete this.store[key];
    }),
    clear: vi.fn(function () {
        this.store = {};
    }),
    length: 0,
    key: vi.fn(function (index) {
        return Object.keys(this.store)[index] || null;
    }),
};
if (hasWindow) {
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
        value: localStorageMock,
        writable: true,
    });
}
// Also set on global
global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;
// Mock crypto for security components
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: (array) => {
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        },
        randomUUID: () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        },
        subtle: {
            encrypt: vi.fn(),
            decrypt: vi.fn(),
            generateKey: vi.fn(),
            importKey: vi.fn(),
            exportKey: vi.fn(),
            sign: vi.fn(),
            verify: vi.fn(),
            digest: vi.fn(),
        },
    },
});
// Mock fetch for API calls
global.fetch = vi.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    clone: function () {
        return this;
    },
    redirected: false,
    type: 'basic',
    url: '',
    body: null,
    bodyUsed: false,
}));
// Mock navigator APIs
Object.defineProperty(global, 'navigator', {
    value: {
        clipboard: {
            writeText: vi.fn(() => Promise.resolve()),
            readText: vi.fn(() => Promise.resolve('')),
        },
        userAgent: 'node',
        language: 'en-US',
        languages: ['en-US'],
        onLine: true,
        connection: {
            effectiveType: '4g',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        },
        mediaDevices: {
            getUserMedia: vi.fn(() => Promise.resolve(new MediaStream())),
            enumerateDevices: vi.fn(() => Promise.resolve([])),
        },
        serviceWorker: {
            register: vi.fn(() => Promise.resolve({ scope: '' })),
            controller: null,
            ready: Promise.resolve({}),
        },
    },
    writable: true,
});
// Mock document APIs only if document exists
if (hasDocument) {
    document.elementFromPoint = vi.fn(() => null);
}
// Mock Element prototype methods only if Element exists
if (typeof Element !== 'undefined') {
    Element.prototype.scrollIntoView = vi.fn();
    // Only mock if not already defined
    if (!Element.prototype.getBoundingClientRect) {
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            top: 0,
            right: 800,
            bottom: 600,
            left: 0,
            toJSON: () => ({}),
        }));
    }
}
// Cleanup after each test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Reset localStorage mock
    localStorageMock.store = {};
});
global.testUtils = {
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    flushPromises: () => new Promise((resolve) => setImmediate(resolve)),
    mockConsole: (method = 'error') => {
        const original = console[method];
        console[method] = vi.fn();
        return () => {
            console[method] = original;
        };
    },
};
export {};
//# sourceMappingURL=test-setup.js.map