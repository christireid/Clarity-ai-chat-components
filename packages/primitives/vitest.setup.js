import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// NOTE: vitest-axe matchers disabled - package not installed via pnpm
// import * as axeMatchers from 'vitest-axe/matchers'
// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);
// NOTE: vitest-axe matchers disabled - uncomment when vitest-axe is added as a dependency
// expect.extend(axeMatchers)
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
    const React = await import('react');
    return {
        motion: new Proxy({}, {
            get(_target, prop) {
                if (typeof prop === 'string') {
                    return ({ children, ...props }) => {
                        const { animate, initial, exit, transition, whileHover, whileTap, ...restProps } = props;
                        return React.createElement(prop, restProps, children);
                    };
                }
                return undefined;
            },
        }),
        AnimatePresence: ({ children }) => children,
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
//# sourceMappingURL=vitest.setup.js.map