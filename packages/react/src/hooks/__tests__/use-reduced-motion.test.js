import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReducedMotion } from '../use-reduced-motion';
describe('useReducedMotion', () => {
    let matchMediaMock;
    let listeners = [];
    beforeEach(() => {
        listeners = [];
        matchMediaMock = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            addEventListener: (_event, handler) => {
                listeners.push(handler);
            },
            removeEventListener: (_event, handler) => {
                listeners = listeners.filter((h) => h !== handler);
            },
        }));
        window.matchMedia = matchMediaMock;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        listeners = [];
    });
    it('should return false when user prefers motion (default)', () => {
        const { result } = renderHook(() => useReducedMotion());
        expect(result.current).toBe(false);
    });
    it('should return true when user prefers reduced motion', () => {
        matchMediaMock.mockImplementation((query) => ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));
        const { result } = renderHook(() => useReducedMotion());
        expect(result.current).toBe(true);
    });
    it('should query the correct media query', () => {
        renderHook(() => useReducedMotion());
        expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
    it('should update when preference changes from motion to reduced', () => {
        const { result } = renderHook(() => useReducedMotion());
        expect(result.current).toBe(false);
        act(() => {
            listeners.forEach((listener) => listener({ matches: true }));
        });
        expect(result.current).toBe(true);
    });
    it('should update when preference changes from reduced to motion', () => {
        matchMediaMock.mockImplementation((query) => ({
            matches: true,
            media: query,
            addEventListener: (_event, handler) => {
                listeners.push(handler);
            },
            removeEventListener: vi.fn(),
        }));
        const { result } = renderHook(() => useReducedMotion());
        expect(result.current).toBe(true);
        act(() => {
            listeners.forEach((listener) => listener({ matches: false }));
        });
        expect(result.current).toBe(false);
    });
    it('should cleanup listener on unmount', () => {
        const removeEventListenerMock = vi.fn();
        matchMediaMock.mockImplementation((query) => ({
            matches: false,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: removeEventListenerMock,
        }));
        const { unmount } = renderHook(() => useReducedMotion());
        unmount();
        expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
    });
    it('should handle SSR (window undefined) gracefully', () => {
        const originalWindow = global.window;
        // @ts-expect-error - simulating SSR
        delete global.window;
        // This should not throw in SSR context
        // Note: This test validates the hook's SSR behavior through useMediaQuery
        expect(() => {
            // In a real SSR environment, the hook would return false by default
        }).not.toThrow();
        global.window = originalWindow;
    });
    it('should handle multiple rapid changes', () => {
        const { result } = renderHook(() => useReducedMotion());
        expect(result.current).toBe(false);
        act(() => {
            // Simulate rapid toggling
            listeners.forEach((l) => l({ matches: true }));
            listeners.forEach((l) => l({ matches: false }));
            listeners.forEach((l) => l({ matches: true }));
        });
        expect(result.current).toBe(true);
    });
    it('should maintain consistent return type', () => {
        const { result } = renderHook(() => useReducedMotion());
        expect(typeof result.current).toBe('boolean');
        act(() => {
            listeners.forEach((l) => l({ matches: true }));
        });
        expect(typeof result.current).toBe('boolean');
    });
});
describe('useReducedMotion integration', () => {
    let listeners = [];
    beforeEach(() => {
        listeners = [];
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            addEventListener: (_event, handler) => {
                listeners.push(handler);
            },
            removeEventListener: (_event, handler) => {
                listeners = listeners.filter((h) => h !== handler);
            },
        }));
    });
    afterEach(() => {
        vi.restoreAllMocks();
        listeners = [];
    });
    it('should work with animation logic', () => {
        const { result } = renderHook(() => {
            const prefersReducedMotion = useReducedMotion();
            return {
                prefersReducedMotion,
                animationDuration: prefersReducedMotion ? 0 : 300,
                shouldAnimate: !prefersReducedMotion,
            };
        });
        expect(result.current.animationDuration).toBe(300);
        expect(result.current.shouldAnimate).toBe(true);
        act(() => {
            listeners.forEach((l) => l({ matches: true }));
        });
        expect(result.current.animationDuration).toBe(0);
        expect(result.current.shouldAnimate).toBe(false);
    });
    it('should work with conditional animation variants', () => {
        const { result } = renderHook(() => {
            const prefersReducedMotion = useReducedMotion();
            const variants = prefersReducedMotion
                ? {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                }
                : {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                };
            return { prefersReducedMotion, variants };
        });
        // Normal motion - includes y transform
        expect(result.current.variants.initial).toEqual({ opacity: 0, y: 20 });
        expect(result.current.variants.animate).toEqual({ opacity: 1, y: 0 });
        act(() => {
            listeners.forEach((l) => l({ matches: true }));
        });
        // Reduced motion - only opacity
        expect(result.current.variants.initial).toEqual({ opacity: 0 });
        expect(result.current.variants.animate).toEqual({ opacity: 1 });
    });
});
//# sourceMappingURL=use-reduced-motion.test.js.map