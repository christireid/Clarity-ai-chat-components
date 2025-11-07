/**
 * Test Utilities for Clarity Chat Components
 *
 * This file provides testing utilities, custom renders, and mock providers
 * for use in component tests.
 */
import { RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { themes } from '../theme';
/**
 * Mock Analytics Provider for testing
 */
export declare const MockAnalyticsProvider: ({ children, }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Mock Error Reporter Provider for testing
 */
export declare const MockErrorReporterProvider: ({ children, }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * All Providers wrapper for testing
 */
export declare const AllTheProviders: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Custom render function that wraps components with all providers
 */
export declare const renderWithProviders: (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
/**
 * Custom render with specific theme
 */
export declare const renderWithTheme: (ui: ReactElement, themeName?: keyof typeof themes, options?: Omit<RenderOptions, "wrapper">) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
/**
 * Mock message data for testing
 */
export declare const createMockMessage: (overrides?: Record<string, unknown>) => {
    id: string;
    chatId: string;
    role: "user";
    content: string;
    status: "sent";
    createdAt: Date;
    updatedAt: Date;
};
/**
 * Mock messages array
 */
export declare const createMockMessages: (count?: number) => {
    id: string;
    chatId: string;
    role: "user";
    content: string;
    status: "sent";
    createdAt: Date;
    updatedAt: Date;
}[];
/**
 * Mock streaming response
 */
export declare const createMockStreamResponse: (text: string, chunkSize?: number) => string[];
/**
 * Mock ReadableStream for testing streaming
 */
export declare const createMockReadableStream: (chunks: string[]) => ReadableStream<any>;
/**
 * Mock fetch for testing API calls
 */
export declare const mockFetch: (response: any, status?: number) => void;
/**
 * Mock IntersectionObserver for testing virtualized lists
 */
export declare const mockIntersectionObserver: () => void;
/**
 * Mock ResizeObserver for testing responsive components
 */
export declare const mockResizeObserver: () => void;
/**
 * Mock localStorage
 */
export declare const mockLocalStorage: () => {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    readonly length: number;
    key: (index: number) => string | null;
};
/**
 * Mock Web Speech API for voice input testing
 */
export declare const mockSpeechRecognition: () => void;
/**
 * Wait for condition helper
 */
export declare const waitForCondition: (condition: () => boolean, timeout?: number, interval?: number) => Promise<void>;
/**
 * Flush promises helper
 */
export declare const flushPromises: () => Promise<unknown>;
/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
/**
 * Custom matchers
 */
declare global {
    namespace Vi {
        interface Matchers<R> {
            toBeAccessible(): R;
        }
    }
}
export { renderWithProviders as render };
//# sourceMappingURL=index.d.ts.map