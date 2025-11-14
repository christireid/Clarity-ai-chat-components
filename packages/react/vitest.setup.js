import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);
// Cleanup after each test
afterEach(() => {
    cleanup();
});
// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
});
// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion');
    return {
        ...actual,
        motion: new Proxy(actual.motion, {
            get(target, prop) {
                // For motion.div, motion.span, etc., return a component that renders without animations
                if (typeof prop === 'string') {
                    return ({ children, ...props }) => {
                        // Remove animation props
                        const { animate, initial, exit, transition, whileHover, whileTap, ...restProps } = props;
                        return actual.createElement(prop, restProps, children);
                    };
                }
                return target[prop];
            },
        }),
    };
});
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
        return [];
    }
    unobserve() { }
};
// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
};
// Mock Web Speech API (for voice input tests)
if (typeof window !== 'undefined') {
    ;
    window.SpeechRecognition = class SpeechRecognition {
        constructor() {
            this.continuous = false;
            this.interimResults = false;
            this.lang = 'en-US';
        }
        start() { }
        stop() { }
        abort() { }
        addEventListener() { }
        removeEventListener() { }
    };
    window.webkitSpeechRecognition = window.SpeechRecognition;
}
// Mock localStorage and sessionStorage
const storageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
};
global.localStorage = storageMock;
global.sessionStorage = storageMock;
//# sourceMappingURL=vitest.setup.js.map