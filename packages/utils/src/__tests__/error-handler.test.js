import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedErrorHandler, handleError } from '../error-handler.js';
describe('UnifiedErrorHandler', () => {
    beforeEach(() => {
        UnifiedErrorHandler.clearHistory();
    });
    it('should handle and process errors', () => {
        const error = new Error('Test error');
        const processed = UnifiedErrorHandler.handle(error);
        expect(processed.message).toBe('Test error');
        expect(processed.type).toBe('Error');
        expect(processed.severity).toBe('low');
    });
    it('should detect critical errors', () => {
        const error = new Error('Heap out of memory');
        const processed = UnifiedErrorHandler.handle(error);
        expect(processed.severity).toBe('critical');
    });
    it('should maintain error history', () => {
        UnifiedErrorHandler.handle(new Error('Error 1'));
        UnifiedErrorHandler.handle(new Error('Error 2'));
        const stats = UnifiedErrorHandler.getStatistics();
        expect(stats.totalErrors).toBe(2);
    });
    it('should identify retryable errors', () => {
        const networkError = new Error('Network timeout');
        expect(UnifiedErrorHandler.isRetryable(networkError)).toBe(true);
        const randomError = new Error('Random error');
        expect(UnifiedErrorHandler.isRetryable(randomError)).toBe(false);
    });
    it('should retry operations', async () => {
        let attempts = 0;
        const operation = vi.fn().mockImplementation(async () => {
            attempts++;
            if (attempts < 2)
                throw new Error('Network timeout');
            return 'success';
        });
        const result = await UnifiedErrorHandler.retryWithBackoff(operation, {
            retryDelay: 10,
            backoffMultiplier: 1
        });
        expect(result).toBe('success');
        expect(attempts).toBe(2);
    });
});
//# sourceMappingURL=error-handler.test.js.map