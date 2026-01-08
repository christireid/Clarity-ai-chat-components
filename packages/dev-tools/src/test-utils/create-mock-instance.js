/**
 * Shared test utilities for creating mock instances in vitest
 *
 * These utilities provide a consistent pattern for mocking classes and singletons
 * in vitest tests, following the established pattern of defining mocks inside
 * the vi.mock factory to avoid hoisting issues.
 *
 * @example
 * ```typescript
 * import { createSingletonMock } from '../../test-utils'
 *
 * let mockInstance: ReturnType<typeof createMockClass> | null = null
 *
 * vi.mock('../../module', () => {
 *   const { createMockClass, getInstance } = createSingletonMock(() => ({
 *     method: vi.fn(),
 *     property: 'value',
 *   }))
 *
 *   return {
 *     getService: () => {
 *       mockInstance = getInstance()
 *       return mockInstance
 *     },
 *   }
 * })
 * ```
 */
import { vi } from 'vitest';
/**
 * Creates a singleton mock factory for use inside vi.mock
 *
 * This helper ensures proper singleton behavior and provides
 * external access to the mock instance for test assertions.
 *
 * @param createMock - Factory function that creates the mock object
 * @returns Object with createMockClass and getInstance functions
 */
export function createSingletonMock(createMock) {
    let instance = null;
    return {
        createMockClass: createMock,
        getInstance: () => {
            if (!instance) {
                instance = createMock();
            }
            return instance;
        },
        reset: () => {
            instance = null;
        },
    };
}
/**
 * Creates a mock class constructor for use inside vi.mock
 *
 * Use this when mocking a class that needs to be instantiated with `new`.
 *
 * @param methods - Object containing mock methods and properties
 * @param onConstruct - Optional callback when instance is created
 * @returns A class constructor that returns the mock
 *
 * @example
 * ```typescript
 * vi.mock('../../debug/time-travel', () => {
 *   let mockInstance: any = null
 *
 *   const MockClass = createMockClass(
 *     {
 *       record: vi.fn(),
 *       clear: vi.fn(),
 *     },
 *     (instance) => { mockInstance = instance }
 *   )
 *
 *   return { TimeTravelDebugger: MockClass }
 * })
 * ```
 */
export function createMockClass(methods, onConstruct) {
    return class MockClass {
        constructor() {
            Object.assign(this, methods);
            if (onConstruct) {
                onConstruct(this);
            }
        }
    };
}
/**
 * Creates common mock methods for testing
 *
 * Provides pre-configured vi.fn() instances for common patterns.
 */
export const mockHelpers = {
    /** Creates a mock that returns an empty array */
    emptyArray: () => vi.fn(() => []),
    /** Creates a mock that returns null */
    returnsNull: () => vi.fn(() => null),
    /** Creates a mock that returns undefined */
    returnsUndefined: () => vi.fn(() => undefined),
    /** Creates a mock that returns the first argument */
    identity: () => vi.fn((x) => x),
    /** Creates a mock that returns a resolved promise */
    asyncResolve: (value) => vi.fn(() => Promise.resolve(value)),
    /** Creates a mock that returns a rejected promise */
    asyncReject: (error) => vi.fn(() => Promise.reject(error)),
    /** Creates a mock that increments a counter and returns a unique ID */
    uniqueId: (prefix = 'id') => {
        let counter = 0;
        return vi.fn(() => `${prefix}-${++counter}`);
    },
};
//# sourceMappingURL=create-mock-instance.js.map