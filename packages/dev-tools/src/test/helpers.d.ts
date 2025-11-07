/**
 * Test helper utilities
 *
 * Provides utilities for testing AI chat applications:
 * - Assertion helpers
 * - Response validation
 * - Token usage testing
 * - Streaming test helpers
 */
/**
 * Assert that a value is truthy
 */
export declare function assert(condition: any, message?: string): asserts condition;
/**
 * Assert equality
 */
export declare function assertEqual<T>(actual: T, expected: T, message?: string): void;
/**
 * Assert deep equality
 */
export declare function assertDeepEqual<T>(actual: T, expected: T, message?: string): void;
/**
 * Assert that a function throws an error
 */
export declare function assertThrows(fn: () => any | Promise<any>, errorType?: new (...args: any[]) => Error, message?: string): Promise<void>;
/**
 * Assert that a value matches a pattern
 */
export declare function assertMatches(actual: string, pattern: RegExp, message?: string): void;
/**
 * Assert that an array contains a value
 */
export declare function assertIncludes<T>(array: T[], value: T, message?: string): void;
/**
 * Validate chat response structure
 */
export declare function validateChatResponse(response: any): {
    valid: boolean;
    errors: string[];
};
/**
 * Validate streaming chunk structure
 */
export declare function validateStreamChunk(chunk: any): {
    valid: boolean;
    errors: string[];
};
/**
 * Collect streaming response
 */
export declare function collectStream(stream: AsyncIterable<any>, extractor?: (chunk: any) => string | null): Promise<{
    content: string;
    chunks: any[];
    duration: number;
}>;
/**
 * Measure response time
 */
export declare function measureResponseTime<T>(fn: () => Promise<T>): Promise<{
    result: T;
    duration: number;
}>;
/**
 * Test token counting accuracy
 */
export declare function validateTokenUsage(usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}, options?: {
    minPromptTokens?: number;
    maxPromptTokens?: number;
    minCompletionTokens?: number;
    maxCompletionTokens?: number;
}): {
    valid: boolean;
    errors: string[];
};
/**
 * Create a test suite
 */
export declare class TestSuite {
    private name;
    private tests;
    private beforeEachHooks;
    private afterEachHooks;
    private beforeAllHooks;
    private afterAllHooks;
    constructor(name: string);
    /**
     * Add a test
     */
    test(name: string, fn: () => Promise<void> | void): this;
    /**
     * Run before each test
     */
    beforeEach(fn: () => Promise<void> | void): this;
    /**
     * Run after each test
     */
    afterEach(fn: () => Promise<void> | void): this;
    /**
     * Run before all tests
     */
    beforeAll(fn: () => Promise<void> | void): this;
    /**
     * Run after all tests
     */
    afterAll(fn: () => Promise<void> | void): this;
    /**
     * Run all tests
     */
    run(): Promise<{
        passed: number;
        failed: number;
        total: number;
        results: Array<{
            name: string;
            status: 'passed' | 'failed';
            error?: Error;
            duration: number;
        }>;
    }>;
}
/**
 * Create a test suite
 */
export declare function createTestSuite(name: string): TestSuite;
//# sourceMappingURL=helpers.d.ts.map