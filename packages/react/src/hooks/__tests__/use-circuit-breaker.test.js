/**
 * Tests for useCircuitBreaker hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCircuitBreaker } from '../use-circuit-breaker';
describe('useCircuitBreaker', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('initial state', () => {
        it('should start in CLOSED state', () => {
            const { result } = renderHook(() => useCircuitBreaker({ name: 'test' }));
            expect(result.current.state).toBe('CLOSED');
            expect(result.current.isAllowed).toBe(true);
        });
        it('should have initial stats', () => {
            const { result } = renderHook(() => useCircuitBreaker({ name: 'test' }));
            expect(result.current.stats.failures).toBe(0);
            expect(result.current.stats.successes).toBe(0);
            expect(result.current.stats.totalRequests).toBe(0);
        });
    });
    describe('execute', () => {
        it('should execute function successfully', async () => {
            const { result } = renderHook(() => useCircuitBreaker({ name: 'test' }));
            let response;
            await act(async () => {
                response = await result.current.execute(() => Promise.resolve('success'));
            });
            expect(response).toBe('success');
            expect(result.current.stats.totalRequests).toBe(1);
        });
        it('should track failures', async () => {
            const { result } = renderHook(() => useCircuitBreaker({ name: 'test', failureThreshold: 3 }));
            await act(async () => {
                try {
                    await result.current.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            });
            expect(result.current.stats.failures).toBe(1);
            expect(result.current.stats.totalFailures).toBe(1);
        });
        it('should open circuit after threshold', async () => {
            const onOpen = vi.fn();
            const { result } = renderHook(() => useCircuitBreaker({
                name: 'test',
                failureThreshold: 2,
                onOpen,
            }));
            // Trigger failures
            for (let i = 0; i < 2; i++) {
                await act(async () => {
                    try {
                        await result.current.execute(() => Promise.reject(new Error('fail')));
                    }
                    catch {
                        // Expected
                    }
                });
            }
            expect(result.current.state).toBe('OPEN');
            expect(onOpen).toHaveBeenCalled();
        });
    });
    describe('state changes', () => {
        it('should call onStateChange', async () => {
            const onStateChange = vi.fn();
            const { result } = renderHook(() => useCircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                onStateChange,
            }));
            await act(async () => {
                try {
                    await result.current.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            });
            expect(onStateChange).toHaveBeenCalledWith('OPEN', 'test');
        });
        it('should update React state on state change', async () => {
            const { result } = renderHook(() => useCircuitBreaker({
                name: 'test',
                failureThreshold: 1,
            }));
            expect(result.current.state).toBe('CLOSED');
            await act(async () => {
                try {
                    await result.current.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            });
            expect(result.current.state).toBe('OPEN');
        });
    });
    describe('reset', () => {
        it('should reset to closed state', async () => {
            const { result } = renderHook(() => useCircuitBreaker({
                name: 'test',
                failureThreshold: 1,
            }));
            // Open the circuit
            await act(async () => {
                try {
                    await result.current.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            });
            expect(result.current.state).toBe('OPEN');
            // Reset
            act(() => {
                result.current.reset();
            });
            expect(result.current.state).toBe('CLOSED');
            expect(result.current.stats.failures).toBe(0);
        });
    });
    describe('isAllowed', () => {
        it('should return false when circuit is open', async () => {
            const { result } = renderHook(() => useCircuitBreaker({
                name: 'test',
                failureThreshold: 1,
                resetTimeout: 30000,
            }));
            await act(async () => {
                try {
                    await result.current.execute(() => Promise.reject(new Error('fail')));
                }
                catch {
                    // Expected
                }
            });
            expect(result.current.isAllowed).toBe(false);
        });
    });
});
//# sourceMappingURL=use-circuit-breaker.test.js.map