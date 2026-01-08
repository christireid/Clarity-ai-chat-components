/**
 * Tests for Circuit Breaker Utility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, CircuitOpenError, createAICircuitBreaker, withCircuitBreaker, isCircuitOpenError, } from '../circuit-breaker';
describe('CircuitBreaker', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('initial state', () => {
        it('should start in CLOSED state', () => {
            const breaker = new CircuitBreaker({ name: 'test' });
            expect(breaker.getState()).toBe('CLOSED');
        });
        it('should have initial stats', () => {
            const breaker = new CircuitBreaker({ name: 'test' });
            const stats = breaker.getStats();
            expect(stats.state).toBe('CLOSED');
            expect(stats.failures).toBe(0);
            expect(stats.successes).toBe(0);
            expect(stats.totalRequests).toBe(0);
            expect(stats.totalFailures).toBe(0);
        });
    });
    describe('successful execution', () => {
        it('should execute function when closed', async () => {
            const breaker = new CircuitBreaker({ name: 'test' });
            const fn = vi.fn().mockResolvedValue('success');
            const result = await breaker.execute(fn);
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });
        it('should track successful requests', async () => {
            const breaker = new CircuitBreaker({ name: 'test' });
            await breaker.execute(() => Promise.resolve('ok'));
            await breaker.execute(() => Promise.resolve('ok'));
            const stats = breaker.getStats();
            expect(stats.totalRequests).toBe(2);
            expect(stats.successes).toBe(2);
        });
    });
    describe('failure handling', () => {
        it('should track failures', async () => {
            const breaker = new CircuitBreaker({ name: 'test', failureThreshold: 5 });
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            const stats = breaker.getStats();
            expect(stats.failures).toBe(1);
            expect(stats.totalFailures).toBe(1);
        });
        it('should open circuit after threshold failures', async () => {
            const onOpen = vi.fn();
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 3,
                onOpen,
            });
            // Trigger 3 failures
            for (let i = 0; i < 3; i++) {
                try {
                    await breaker.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            }
            expect(breaker.getState()).toBe('OPEN');
            expect(onOpen).toHaveBeenCalledWith('test', 3, expect.any(Error));
        });
        it('should not count filtered errors as failures', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 3,
                isFailure: (error) => !error.message.includes('abort'),
            });
            // These should not count
            for (let i = 0; i < 5; i++) {
                try {
                    await breaker.execute(() => Promise.reject(new Error('abort')));
                }
                catch {
                    // Expected
                }
            }
            expect(breaker.getState()).toBe('CLOSED');
            expect(breaker.getStats().totalFailures).toBe(0);
        });
    });
    describe('open state', () => {
        it('should reject requests when open', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 30000,
            });
            // Open the circuit
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            // Should reject immediately
            await expect(breaker.execute(() => Promise.resolve('ok'))).rejects.toThrow(CircuitOpenError);
        });
        it('should include retry time in error', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 30000,
            });
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            try {
                await breaker.execute(() => Promise.resolve('ok'));
            }
            catch (error) {
                expect(error).toBeInstanceOf(CircuitOpenError);
                expect(error.circuitName).toBe('test');
                expect(error.nextRetryTime).toBeGreaterThan(Date.now());
            }
        });
        it('should call onReject when rejecting', async () => {
            const onReject = vi.fn();
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                onReject,
            });
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            try {
                await breaker.execute(() => Promise.resolve('ok'));
            }
            catch {
                // Expected
            }
            expect(onReject).toHaveBeenCalledWith('test');
        });
    });
    describe('half-open state', () => {
        it('should transition to half-open after reset timeout', async () => {
            const onStateChange = vi.fn();
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 30000,
                onStateChange,
            });
            // Open the circuit
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            expect(breaker.getState()).toBe('OPEN');
            // Advance past reset timeout
            await vi.advanceTimersByTimeAsync(30001);
            // Next request should transition to half-open
            await breaker.execute(() => Promise.resolve('ok'));
            expect(onStateChange).toHaveBeenCalledWith('HALF_OPEN', 'test');
        });
        it('should close after success threshold in half-open', async () => {
            const onClose = vi.fn();
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 1000,
                successThreshold: 2,
                onClose,
            });
            // Open the circuit
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            // Advance past reset timeout
            await vi.advanceTimersByTimeAsync(1001);
            // Two successes should close
            await breaker.execute(() => Promise.resolve('ok'));
            await breaker.execute(() => Promise.resolve('ok'));
            expect(breaker.getState()).toBe('CLOSED');
            expect(onClose).toHaveBeenCalledWith('test');
        });
        it('should reopen on failure in half-open', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 1000,
            });
            // Open the circuit
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            // Advance past reset timeout
            await vi.advanceTimersByTimeAsync(1001);
            // Trigger transition to half-open with a success
            await breaker.execute(() => Promise.resolve('ok'));
            expect(breaker.getState()).toBe('HALF_OPEN');
            // Then fail - should reopen
            try {
                await breaker.execute(() => Promise.reject(new Error('fail again')));
            }
            catch {
                // Expected
            }
            expect(breaker.getState()).toBe('OPEN');
        });
    });
    describe('sliding window', () => {
        it('should prune old failures', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 5,
                windowDuration: 10000,
            });
            // Add some failures
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            expect(breaker.getStats().failures).toBe(2);
            // Advance past window
            await vi.advanceTimersByTimeAsync(11000);
            // Old failures should be pruned
            expect(breaker.getStats().failures).toBe(0);
        });
    });
    describe('manual reset', () => {
        it('should reset to closed state', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
            });
            // Open the circuit
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            expect(breaker.getState()).toBe('OPEN');
            breaker.reset();
            expect(breaker.getState()).toBe('CLOSED');
            expect(breaker.getStats().failures).toBe(0);
        });
    });
    describe('isAllowed', () => {
        it('should return true when closed', () => {
            const breaker = new CircuitBreaker({ name: 'test' });
            expect(breaker.isAllowed()).toBe(true);
        });
        it('should return false when open', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 30000,
            });
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            expect(breaker.isAllowed()).toBe(false);
        });
        it('should return true after reset timeout', async () => {
            const breaker = new CircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 1000,
            });
            try {
                await breaker.execute(() => Promise.reject(new Error('fail')));
            }
            catch {
                // Expected
            }
            await vi.advanceTimersByTimeAsync(1001);
            expect(breaker.isAllowed()).toBe(true);
        });
    });
});
describe('createAICircuitBreaker', () => {
    it('should create breaker with AI-specific defaults', () => {
        const breaker = createAICircuitBreaker('openai');
        const stats = breaker.getStats();
        expect(stats.state).toBe('CLOSED');
    });
    it('should not count AbortError as failure', async () => {
        const breaker = createAICircuitBreaker('openai', {
            failureThreshold: 1,
        });
        const abortError = new Error('Operation cancelled');
        abortError.name = 'AbortError';
        try {
            await breaker.execute(() => Promise.reject(abortError));
        }
        catch {
            // Expected
        }
        expect(breaker.getState()).toBe('CLOSED');
    });
    it('should allow custom options', () => {
        const onOpen = vi.fn();
        const breaker = createAICircuitBreaker('anthropic', {
            failureThreshold: 10,
            onOpen,
        });
        expect(breaker.getState()).toBe('CLOSED');
    });
});
describe('withCircuitBreaker', () => {
    it('should wrap function with circuit breaker', async () => {
        const breaker = new CircuitBreaker({ name: 'test' });
        const fn = vi.fn().mockResolvedValue('result');
        const wrapped = withCircuitBreaker(breaker, fn);
        const result = await wrapped();
        expect(result).toBe('result');
        expect(fn).toHaveBeenCalled();
    });
    it('should pass arguments through', async () => {
        const breaker = new CircuitBreaker({ name: 'test' });
        const fn = vi
            .fn()
            .mockImplementation((a, b) => Promise.resolve(a + b));
        const wrapped = withCircuitBreaker(breaker, fn);
        const result = await wrapped(2, 3);
        expect(result).toBe(5);
        expect(fn).toHaveBeenCalledWith(2, 3);
    });
});
describe('CircuitOpenError', () => {
    it('should have correct properties', () => {
        const error = new CircuitOpenError('test-api', Date.now() + 30000);
        expect(error.name).toBe('CircuitOpenError');
        expect(error.circuitName).toBe('test-api');
        expect(error.nextRetryTime).toBeGreaterThan(Date.now());
        expect(error.message).toContain('test-api');
        expect(error.message).toContain('OPEN');
    });
});
describe('isCircuitOpenError', () => {
    it('should return true for CircuitOpenError', () => {
        const error = new CircuitOpenError('test', Date.now());
        expect(isCircuitOpenError(error)).toBe(true);
    });
    it('should return false for other errors', () => {
        const error = new Error('Not a circuit error');
        expect(isCircuitOpenError(error)).toBe(false);
    });
    it('should return false for null/undefined', () => {
        expect(isCircuitOpenError(null)).toBe(false);
        expect(isCircuitOpenError(undefined)).toBe(false);
    });
});
//# sourceMappingURL=circuit-breaker.test.js.map