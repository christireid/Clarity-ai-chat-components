/**
 * Test suite for enhanced performance optimization utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  // Core performance hooks
  useMemoizedCallback,
  useBatchedState,
  // Effect optimization hooks
  useUpdateEffect,
  useThrottledEffect,
  useDebouncedEffect,
  // Memoization hooks
  useMemoizedSelector,
  useDeepMemo,
  // Virtual scrolling
  useVirtualList,
  useDynamicVirtualList,
  // Event handling
  useEventDelegation,
  useIntersectionObserver,
  // Context optimization
  useContextSelector,
  useMultipleContexts,
  // Utility functions
  measurePerformance,
} from '../performance/enhanced';

// Mock SecureLogger
vi.mock('@/lib/security/secureLogger', () => ({
  SecureLogger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Enhanced Performance Optimization Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useMemoizedCallback', () => {
    it('should maintain referential equality of callback', () => {
      const callback = vi.fn();
      const deps = [1, 2, 3];

      const { result, rerender } = renderHook(() => 
        useMemoizedCallback(callback, deps)
      );

      const firstCallback = result.current;
      rerender();
      const secondCallback = result.current;

      expect(firstCallback).toBe(secondCallback);
    });

    it('should update callback when dependencies change', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      const { result, rerender } = renderHook(
        ({ cb, deps }) => useMemoizedCallback(cb, deps),
        { 
          initialProps: { cb: callback1, deps: [1] } 
        }
      );

      const firstCallback = result.current;
      
      rerender({ cb: callback2, deps: [2] });
      const secondCallback = result.current;

      expect(firstCallback).not.toBe(secondCallback);
    });

    it('should execute the correct callback function', () => {
      const callback = vi.fn((x: number) => x * 2);
      const { result } = renderHook(() => 
        useMemoizedCallback(callback, [])
      );

      const returnedValue = result.current(5);
      
      expect(callback).toHaveBeenCalledWith(5);
      expect(returnedValue).toBe(10);
    });
  });

  describe('useBatchedState', () => {
    it('should batch multiple state updates', () => {
      const { result } = renderHook(() => 
        useBatchedState({ count: 0, name: 'test' })
      );

      const [, setState, startBatch, endBatch] = result.current;

      act(() => {
        startBatch();
        setState({ count: 1 });
        setState({ name: 'updated' });
        setState({ count: 2 });
        endBatch();
      });

      expect(result.current[0]).toEqual({ count: 2, name: 'updated' });
    });

    it('should handle function updates in batch', () => {
      const { result } = renderHook(() => 
        useBatchedState({ count: 0 })
      );

      const [, setState, startBatch, endBatch] = result.current;

      act(() => {
        startBatch();
        setState(prev => ({ count: prev.count + 1 }));
        setState(prev => ({ count: prev.count + 1 }));
        endBatch();
      });

      expect(result.current[0].count).toBe(2);
    });

    it('should handle non-batched updates normally', () => {
      const { result } = renderHook(() => 
        useBatchedState({ count: 0 })
      );

      const [, setState] = result.current;

      act(() => {
        setState({ count: 1 });
      });

      expect(result.current[0].count).toBe(1);
    });
  });

  describe('useUpdateEffect', () => {
    it('should skip initial render', () => {
      const effect = vi.fn();
      const { rerender } = renderHook(() => 
        useUpdateEffect(effect, [])
      );

      expect(effect).not.toHaveBeenCalled();

      rerender();
      expect(effect).toHaveBeenCalledTimes(1);

      rerender();
      expect(effect).toHaveBeenCalledTimes(2);
    });

    it('should handle cleanup function', () => {
      const cleanup = vi.fn();
      const effect = vi.fn(() => cleanup);

      const { rerender } = renderHook(() => 
        useUpdateEffect(effect, [])
      );

      rerender(); // First update - runs effect
      expect(effect).toHaveBeenCalledTimes(1);

      rerender(); // Second update - runs cleanup and effect
      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledTimes(2);
    });
  });

  describe('useThrottledEffect', () => {
    it('should throttle effect execution', () => {
      const effect = vi.fn();
      const delay = 1000;

      const { rerender } = renderHook(() => 
        useThrottledEffect(effect, [], delay)
      );

      expect(effect).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(delay);
      });

      expect(effect).toHaveBeenCalledTimes(1);

      // Trigger another update
      rerender();
      
      act(() => {
        vi.advanceTimersByTime(delay);
      });

      expect(effect).toHaveBeenCalledTimes(2);
    });

    it('should cancel previous timeout on update', () => {
      const effect = vi.fn();
      const delay = 1000;

      const { rerender } = renderHook(() => 
        useThrottledEffect(effect, [1], delay)
      );

      // Trigger update before timeout completes
      rerender({ initialProps: [2] });

      act(() => {
        vi.advanceTimersByTime(delay);
      });

      // Effect should only be called once (for the latest update)
      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useDebouncedEffect', () => {
    it('should debounce effect execution', () => {
      const effect = vi.fn();
      const delay = 500;

      const { rerender } = renderHook(() => 
        useDebouncedEffect(effect, [], delay)
      );

      // Multiple rapid updates
      rerender();
      rerender();
      rerender();

      expect(effect).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(delay);
      });

      // Effect should only be called once after debounce delay
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on each update', () => {
      const effect = vi.fn();
      const delay = 500;

      const { rerender } = renderHook(() => 
        useDebouncedEffect(effect, [1], delay)
      );

      // Advance partially and trigger update
      act(() => {
        vi.advanceTimersByTime(300);
      });
      rerender({ initialProps: [2] });

      // Advance more - should still not trigger effect
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(effect).not.toHaveBeenCalled();

      // Now advance past the delay from the last update
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMemoizedSelector', () => {
    it('should memoize selector results', () => {
      const selector = vi.fn((state: { count: number }) => state.count * 2);
      const state = { count: 5 };

      const { result, rerender } = renderHook(() => 
        useMemoizedSelector(selector, state)
      );

      expect(result.current).toBe(10);
      expect(selector).toHaveBeenCalledTimes(1);

      // Rerender with same state
      rerender();
      expect(result.current).toBe(10);
      expect(selector).toHaveBeenCalledTimes(1); // Should not be called again

      // Rerender with new state
      const newState = { count: 7 };
      rerender({ initialProps: { selector, state: newState } });
      expect(result.current).toBe(14);
      expect(selector).toHaveBeenCalledTimes(2);
    });
  });

  describe('useDeepMemo', () => {
    it('should perform deep comparison of dependencies', () => {
      const factory = vi.fn(() => ({ computed: 'value' }));
      const deps1 = [{ a: 1 }, { b: 2 }];
      const deps2 = [{ a: 1 }, { b: 2 }]; // Same content, different reference

      const { result, rerender } = renderHook(() => 
        useDeepMemo(factory, deps1)
      );

      expect(result.current).toEqual({ computed: 'value' });
      expect(factory).toHaveBeenCalledTimes(1);

      // Rerender with same content but different reference
      rerender({ initialProps: { factory, deps: deps2 } });
      
      expect(factory).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should recompute when content changes', () => {
      const factory = vi.fn(() => ({ computed: 'value' }));
      const deps1 = [{ a: 1 }, { b: 2 }];
      const deps2 = [{ a: 2 }, { b: 2 }]; // Different content

      const { result, rerender } = renderHook(() => 
        useDeepMemo(factory, deps1)
      );

      expect(factory).toHaveBeenCalledTimes(1);

      // Rerender with different content
      rerender({ initialProps: { factory, deps: deps2 } });
      
      expect(factory).toHaveBeenCalledTimes(2); // Should be called again
    });
  });

  describe('useVirtualList', () => {
    it('should virtualize large lists', () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`
      }));
      
      const config = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 2
      };

      const { result } = renderHook(() => 
        useVirtualList(items, config)
      );

      expect(result.current.virtualItems.length).toBeLessThan(items.length);
      expect(result.current.totalHeight).toBe(1000 * 50);
      expect(result.current.paddingTop).toBeGreaterThanOrEqual(0);
      expect(result.current.paddingBottom).toBeGreaterThanOrEqual(0);
    });

    it('should handle scroll position changes', () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      const config = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 1
      };

      const { result } = renderHook(() => 
        useVirtualList(items, config)
      );

      const initialStartIndex = result.current.startIndex;

      act(() => {
        result.current.setScrollTop(100); // Scroll down
      });

      expect(result.current.startIndex).toBeGreaterThan(initialStartIndex);
    });

    it('should handle overscan correctly', () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      const config = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 3
      };

      const { result } = renderHook(() => 
        useVirtualList(items, config)
      );

      const visibleCount = Math.ceil(config.containerHeight / config.itemHeight);
      const expectedItems = visibleCount + config.overscan * 2; // overscan on both sides

      expect(result.current.virtualItems.length).toBeLessThanOrEqual(expectedItems);
    });
  });

  describe('useDynamicVirtualList', () => {
    it('should handle variable item heights', () => {
      const items = Array.from({ length: 50 }, (_, i) => i);
      const getItemHeight = (item: number) => (item % 2 === 0 ? 50 : 100);
      const config = {
        containerHeight: 200,
        overscan: 2
      };

      const { result } = renderHook(() => 
        useDynamicVirtualList(items, getItemHeight, config)
      );

      expect(result.current.virtualItems.length).toBeGreaterThan(0);
      expect(result.current.totalHeight).toBeGreaterThan(0);
    });

    it('should calculate correct start and end indices', () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      const getItemHeight = () => 50; // Uniform height for predictable behavior
      const config = {
        containerHeight: 200,
        overscan: 1
      };

      const { result } = renderHook(() => 
        useDynamicVirtualList(items, getItemHeight, config)
      );

      act(() => {
        result.current.setScrollTop(100);
      });

      // Should have reasonable start and end indices
      expect(result.current.startIndex).toBeGreaterThanOrEqual(0);
      expect(result.current.endIndex).toBeLessThan(items.length);
      expect(result.current.startIndex).toBeLessThanOrEqual(result.current.endIndex);
    });
  });

  describe('useEventDelegation', () => {
    it('should delegate events to container', () => {
      const handler = vi.fn();
      const container = document.createElement('div');
      const containerRef = { current: container };

      const { unmount } = renderHook(() => 
        useEventDelegation('click', handler, containerRef)
      );

      const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should handle different event types', () => {
      const clickHandler = vi.fn();
      const keyHandler = vi.fn();
      const container = document.createElement('div');
      const containerRef = { current: container };

      renderHook(() => {
        useEventDelegation('click', clickHandler, containerRef);
        useEventDelegation('keydown', keyHandler, containerRef);
      });

      const addEventListenerSpy = vi.spyOn(container, 'addEventListener');

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: true });
    });
  });

  describe('useContextSelector', () => {
    it('should select specific context values', () => {
      const TestContext = React.createContext({ count: 5, name: 'test' });
      const selector = (value: { count: number; name: string }) => value.count;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TestContext.Provider value={{ count: 10, name: 'updated' }}>
          {children}
        </TestContext.Provider>
      );

      const { result } = renderHook(() => 
        useContextSelector(TestContext, selector),
        { wrapper }
      );

      expect(result.current).toBe(10);
    });

    it('should prevent unnecessary re-renders', () => {
      const TestContext = React.createContext({ count: 5, name: 'test' });
      const selector = vi.fn((value: { count: number; name: string }) => value.count);

      const { rerender } = renderHook(() => 
        useContextSelector(TestContext, selector)
      );

      expect(selector).toHaveBeenCalledTimes(1);

      // Same context value - should not call selector again
      rerender();
      expect(selector).toHaveBeenCalledTimes(1);
    });
  });

  describe('measurePerformance', () => {
    it('should measure function execution time', () => {
      const mockPerformance = {
        now: vi.fn()
          .mockReturnValueOnce(1000)  // start
          .mockReturnValueOnce(1500), // end
      };
      global.performance = mockPerformance as any;

      const testFunction = vi.fn(() => 'result');
      const result = measurePerformance('test', testFunction);

      expect(testFunction).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should handle functions that throw errors', () => {
      const mockPerformance = {
        now: vi.fn()
          .mockReturnValueOnce(1000)
          .mockReturnValueOnce(1001),
      };
      global.performance = mockPerformance as any;

      const errorFunction = () => {
        throw new Error('Test error');
      };

      expect(() => measurePerformance('test', errorFunction)).toThrow('Test error');
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a performance-optimized component', () => {
      const TestComponent = () => {
        // Memoized callback
        const handleClick = useMemoizedCallback((id: number) => {
          console.log('Clicked:', id);
        }, []);

        // Batched state
        const [state, setState, startBatch, endBatch] = useBatchedState({
          count: 0,
          items: Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
        });

        // Virtual list for large datasets
        const virtualList = useVirtualList(state.items, {
          itemHeight: 50,
          containerHeight: 200,
          overscan: 2
        });

        // Context selector
        const TestContext = React.createContext({ theme: 'light' });
        const theme = useContextSelector(TestContext, ctx => ctx.theme);

        return null;
      };

      const { unmount } = renderHook(() => TestComponent());
      unmount();
    });

    it('should handle performance optimization scenarios', () => {
      // Test scenario: Rapid state updates
      const { result } = renderHook(() => 
        useBatchedState({ count: 0 })
      );

      const [, setState, startBatch, endBatch] = result.current;

      // Simulate rapid updates
      act(() => {
        startBatch();
        for (let i = 0; i < 10; i++) {
          setState({ count: i });
        }
        endBatch();
      });

      // Should only have one re-render at the end
      expect(result.current[0].count).toBe(9);
    });

    it('should handle edge cases gracefully', () => {
      // Empty virtual list
      const { result: emptyResult } = renderHook(() => 
        useVirtualList([], {
          itemHeight: 50,
          containerHeight: 200
        })
      );

      expect(emptyResult.current.virtualItems).toEqual([]);
      expect(emptyResult.current.totalHeight).toBe(0);

      // Negative scroll position
      const { result: scrollResult } = renderHook(() => 
        useVirtualList([1, 2, 3], {
          itemHeight: 50,
          containerHeight: 200
        })
      );

      act(() => {
        scrollResult.current.setScrollTop(-100);
      });

      expect(scrollResult.current.startIndex).toBeGreaterThanOrEqual(0);
    });
  });
});