/**
 * Tests for useClarityChat hook and its helpers
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractTextContent, validateApiEndpoint, retryOperation, classifyError, } from '../helpers';
describe('useClarityChat helpers', () => {
    describe('extractTextContent', () => {
        it('should return string content as-is', () => {
            expect(extractTextContent('Hello world')).toBe('Hello world');
        });
        it('should extract text from array of content parts', () => {
            const content = [
                { type: 'text', text: 'Hello' },
                { type: 'image', url: 'http://example.com/img.png' },
                { type: 'text', text: 'World' },
            ];
            expect(extractTextContent(content)).toBe('Hello World');
        });
        it('should handle empty array', () => {
            expect(extractTextContent([])).toBe('');
        });
        it('should handle array with no text parts', () => {
            const content = [{ type: 'image', url: 'http://example.com/img.png' }];
            expect(extractTextContent(content)).toBe('');
        });
        it('should stringify unknown content types', () => {
            const content = { custom: 'data', nested: { value: 123 } };
            const result = extractTextContent(content);
            expect(result).toBe(JSON.stringify(content));
        });
        it('should handle null content', () => {
            const result = extractTextContent(null);
            expect(result).toBe('null');
        });
    });
    describe('validateApiEndpoint', () => {
        it('should throw for undefined api', () => {
            expect(() => validateApiEndpoint(undefined)).toThrow('api');
        });
        it('should throw for empty string', () => {
            expect(() => validateApiEndpoint('')).toThrow('api');
        });
        it('should throw for whitespace-only string', () => {
            expect(() => validateApiEndpoint('   ')).toThrow('api');
        });
        it('should not throw for valid api endpoint', () => {
            expect(() => validateApiEndpoint('/api/chat')).not.toThrow();
        });
        it('should not throw for full URL', () => {
            expect(() => validateApiEndpoint('https://api.example.com/chat')).not.toThrow();
        });
        it('should include helpful error message', () => {
            try {
                validateApiEndpoint(undefined);
            }
            catch (error) {
                expect(error.message).toContain('useClarityChat');
                expect(error.message).toContain('api');
                expect(error.message).toContain('Example');
            }
        });
    });
    describe('retryOperation', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });
        it('should return result on first successful attempt', async () => {
            const operation = vi.fn().mockResolvedValue('success');
            const resultPromise = retryOperation(operation, 3, 100);
            await vi.runAllTimersAsync();
            const result = await resultPromise;
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });
        it('should retry on failure and succeed', async () => {
            const operation = vi
                .fn()
                .mockRejectedValueOnce(new Error('fail1'))
                .mockResolvedValue('success');
            const resultPromise = retryOperation(operation, 3, 100);
            // First attempt fails
            await vi.advanceTimersByTimeAsync(0);
            // Wait for retry delay (100ms)
            await vi.advanceTimersByTimeAsync(100);
            const result = await resultPromise;
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        });
        it('should throw after max attempts exhausted', async () => {
            vi.useRealTimers(); // Use real timers for this test to avoid unhandled rejection
            const operation = vi.fn().mockRejectedValue(new Error('always fails'));
            await expect(retryOperation(operation, 2, 10)).rejects.toThrow('always fails');
            expect(operation).toHaveBeenCalledTimes(2);
            vi.useFakeTimers(); // Restore fake timers
        });
        it('should use exponential backoff', async () => {
            const operation = vi
                .fn()
                .mockRejectedValueOnce(new Error('fail1'))
                .mockRejectedValueOnce(new Error('fail2'))
                .mockResolvedValue('success');
            const resultPromise = retryOperation(operation, 3, 100);
            // First attempt
            await vi.advanceTimersByTimeAsync(0);
            expect(operation).toHaveBeenCalledTimes(1);
            // First retry after 100ms (100 * 2^0)
            await vi.advanceTimersByTimeAsync(100);
            expect(operation).toHaveBeenCalledTimes(2);
            // Second retry after 200ms (100 * 2^1)
            await vi.advanceTimersByTimeAsync(200);
            expect(operation).toHaveBeenCalledTimes(3);
            await resultPromise;
        });
    });
    describe('classifyError', () => {
        it('should classify network errors', () => {
            const error = new Error('Network error');
            error.name = 'NetworkError';
            expect(classifyError(error)).toBe('network');
        });
        it('should classify fetch errors', () => {
            const error = new Error('Failed to fetch');
            expect(classifyError(error)).toBe('network');
        });
        it('should classify rate limit errors', () => {
            const error = new Error('Rate limit exceeded');
            expect(classifyError(error)).toBe('ratelimit');
        });
        it('should classify authentication errors', () => {
            const error = new Error('Unauthorized access');
            expect(classifyError(error)).toBe('auth');
        });
        it('should classify 401 errors', () => {
            const error = new Error('Request failed with status 401');
            expect(classifyError(error)).toBe('auth');
        });
        it('should classify 403 errors', () => {
            const error = new Error('Request failed with status 403');
            expect(classifyError(error)).toBe('auth');
        });
        it('should classify server errors (500)', () => {
            const error = new Error('Request failed with status 500');
            expect(classifyError(error)).toBe('server');
        });
        it('should classify server errors (503)', () => {
            const error = new Error('Request failed with status 503');
            expect(classifyError(error)).toBe('server');
        });
        it('should classify unknown errors', () => {
            const error = new Error('Something unexpected happened');
            expect(classifyError(error)).toBe('unknown');
        });
    });
});
//# sourceMappingURL=helpers.test.js.map