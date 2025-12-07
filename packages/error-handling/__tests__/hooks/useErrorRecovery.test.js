import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorRecovery } from '../../src/hooks/useErrorRecovery';
describe('useErrorRecovery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should initialize with empty strategies', () => {
        const { result } = renderHook(() => useErrorRecovery());
        expect(result.current.strategies.size).toBe(0);
        expect(result.current.isRecovering).toBe(false);
        expect(result.current.lastRecoveryError).toBeNull();
    });
    it('should register a recovery strategy', () => {
        const { result } = renderHook(() => useErrorRecovery());
        const strategy = vi.fn().mockResolvedValue(undefined);
        act(() => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        expect(result.current.strategies.size).toBe(1);
        expect(result.current.strategies.get('API_ERROR')).toBe(strategy);
    });
    it('should unregister a recovery strategy', () => {
        const { result } = renderHook(() => useErrorRecovery());
        const strategy = vi.fn().mockResolvedValue(undefined);
        act(() => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        expect(result.current.strategies.size).toBe(1);
        act(() => {
            result.current.unregisterStrategy('API_ERROR');
        });
        expect(result.current.strategies.size).toBe(0);
    });
    it('should execute recovery strategy successfully', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const strategy = vi.fn().mockResolvedValue(undefined);
        act(() => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        let recoveryResult;
        await act(async () => {
            recoveryResult = await result.current.recover('API_ERROR');
        });
        expect(recoveryResult).toBe(true);
        expect(strategy).toHaveBeenCalledTimes(1);
        expect(result.current.isRecovering).toBe(false);
        expect(result.current.lastRecoveryError).toBeNull();
    });
    it('should handle async recovery strategy', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const strategy = vi.fn().mockResolvedValue(undefined);
        await act(async () => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        const recoveryPromise = act(async () => {
            return await result.current.recover('API_ERROR');
        });
        const recoveryResult = await recoveryPromise;
        expect(recoveryResult).toBe(true);
        expect(strategy).toHaveBeenCalledTimes(1);
        expect(result.current.isRecovering).toBe(false);
    });
    it('should handle recovery strategy failure', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const strategy = vi.fn().mockRejectedValue(new Error('Recovery failed'));
        await act(async () => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        let recoveryResult;
        await act(async () => {
            recoveryResult = await result.current.recover('API_ERROR');
        });
        expect(recoveryResult).toBe(false);
        expect(strategy).toHaveBeenCalledTimes(1);
        expect(result.current.isRecovering).toBe(false);
        expect(result.current.lastRecoveryError).toBeInstanceOf(Error);
        expect(result.current.lastRecoveryError?.message).toBe('Recovery failed');
        consoleErrorSpy.mockRestore();
    });
    it('should handle non-Error rejection in recovery strategy', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const strategy = vi.fn().mockRejectedValue('String error');
        await act(async () => {
            result.current.registerStrategy('API_ERROR', strategy);
        });
        let recoveryResult;
        await act(async () => {
            recoveryResult = await result.current.recover('API_ERROR');
        });
        expect(recoveryResult).toBe(false);
        expect(result.current.lastRecoveryError).toBeInstanceOf(Error);
        expect(result.current.lastRecoveryError?.message).toBe('String error');
        consoleErrorSpy.mockRestore();
    });
    it('should return false for unregistered strategy', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        let recoveryResult;
        await act(async () => {
            recoveryResult = await result.current.recover('UNKNOWN_ERROR');
        });
        expect(recoveryResult).toBe(false);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('No recovery strategy found'));
        consoleWarnSpy.mockRestore();
    });
    it('should reset recovery state', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const strategy = vi.fn().mockRejectedValue(new Error('Test error'));
        // Set some state by triggering a recovery failure
        await act(async () => {
            result.current.registerStrategy('TEST_ERROR', strategy);
        });
        let recoveryResult;
        await act(async () => {
            recoveryResult = await result.current.recover('TEST_ERROR');
        });
        expect(recoveryResult).toBe(false);
        // Verify error was set (same pattern as other tests)
        expect(result.current.lastRecoveryError).toBeInstanceOf(Error);
        expect(result.current.lastRecoveryError?.message).toBe('Test error');
        // Reset the state
        await act(async () => {
            result.current.reset();
        });
        expect(result.current.lastRecoveryError).toBeNull();
        expect(result.current.isRecovering).toBe(false);
        consoleErrorSpy.mockRestore();
    });
    it('should handle multiple registered strategies', async () => {
        const { result } = renderHook(() => useErrorRecovery());
        const strategy1 = vi.fn().mockResolvedValue(undefined);
        const strategy2 = vi.fn().mockResolvedValue(undefined);
        await act(async () => {
            result.current.registerStrategy('API_ERROR', strategy1);
            result.current.registerStrategy('AUTH_ERROR', strategy2);
        });
        expect(result.current.strategies.size).toBe(2);
        expect(result.current.strategies.get('API_ERROR')).toBe(strategy1);
        expect(result.current.strategies.get('AUTH_ERROR')).toBe(strategy2);
    });
});
//# sourceMappingURL=useErrorRecovery.test.js.map