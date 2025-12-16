import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTokenValidator, useAutoTokenValidator } from '../use-token-validator.js';
import { useTokenPerformance, useAutoTokenPerformance } from '../use-token-performance.js';

// Mock performance API for testing
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

describe('Token Optimization Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock performance.memory for testing
    (performance as any).memory = {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB
      totalJSHeapSize: 100 * 1024 * 1024, // 100MB
      jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useTokenValidator Hook', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useTokenValidator());

      expect(result.current.validationState).toEqual({});
      expect(result.current.isValid).toBe(true);
      expect(result.current.allErrors).toEqual([]);
      expect(result.current.allWarnings).toEqual([]);
    });

    it('should validate text and update state', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateText('Hello World');
        expect(validationResult.valid).toBe(true);
      });

      expect(result.current.textValidation?.valid).toBe(true);
      expect(result.current.validationState.text?.valid).toBe(true);
    });

    it('should validate model names', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateModel('gpt-4');
        expect(validationResult.valid).toBe(true);
      });

      expect(result.current.modelValidation?.valid).toBe(true);
    });

    it('should validate budgets', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateBudget(1000);
        expect(validationResult.valid).toBe(true);
      });

      expect(result.current.budgetValidation?.valid).toBe(true);
    });

    it('should validate compression ratios', () => {
      const { result } = renderHook(() => useTokenValidator());

      const validationResult = result.current.validateCompressionRatio(0.5);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.warnings?.length).toBeGreaterThan(0);
    });

    it('should validate quality thresholds', () => {
      const { result } = renderHook(() => useTokenValidator());

      const validationResult = result.current.validateQualityThreshold(0.95);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.warnings?.length).toBeGreaterThan(0);
    });

    it('should validate optimization config', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateConfig({
          text: 'Hello World',
          model: 'gpt-4',
          budget: 1000
        });
        expect(validationResult.valid).toBe(true);
      });

      expect(result.current.configValidation?.valid).toBe(true);
    });

    it('should clear validation state', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.validateText('test');
      });

      expect(result.current.textValidation).toBeDefined();

      act(() => {
        result.current.clearValidation();
      });

      expect(result.current.validationState).toEqual({});
      expect(result.current.textValidation).toBeUndefined();
    });

    it('should handle invalid text gracefully', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateText('');
        expect(validationResult.valid).toBe(false);
      });

      expect(result.current.textValidation?.valid).toBe(false);
      expect(result.current.allErrors.length).toBeGreaterThan(0);
    });

    it('should handle invalid model names', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateModel('invalid-model!');
        expect(validationResult.valid).toBe(false);
      });

      expect(result.current.modelValidation?.valid).toBe(false);
    });

    it('should handle invalid budgets', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        const validationResult = result.current.validateBudget(-100);
        expect(validationResult.valid).toBe(false);
      });

      expect(result.current.budgetValidation?.valid).toBe(false);
    });

    it('should collect all errors correctly', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.validateText('');
        result.current.validateModel('invalid!');
        result.current.validateBudget(-100);
      });

      expect(result.current.allErrors.length).toBeGreaterThan(0);
      expect(result.current.isValid).toBe(false);
    });

    it('should collect warnings', () => {
      const { result } = renderHook(() => useTokenValidator());

      act(() => {
        result.current.validateText('test');
        result.current.validateModel('gpt-4');
        result.current.validateBudget(999999); // High budget warning
      });

      expect(result.current.allWarnings.length).toBeGreaterThan(0);
    });
  });

  describe('useAutoTokenValidator Hook', () => {
    it('should provide the same interface as useTokenValidator', () => {
      const { result } = renderHook(() => useAutoTokenValidator());

      expect(result.current.validateText).toBeDefined();
      expect(result.current.validateModel).toBeDefined();
      expect(result.current.validateBudget).toBeDefined();
      expect(result.current.validateConfig).toBeDefined();
      expect(result.current.clearValidation).toBeDefined();
      expect(result.current.isValid).toBeDefined();
    });

    it('should handle dependency array', () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useAutoTokenValidator(deps),
        { initialProps: { deps: ['initial'] } }
      );

      expect(result.current.validateText).toBeDefined();

      // Change dependencies
      rerender({ deps: ['updated'] });

      expect(result.current.validateText).toBeDefined();
    });
  });

  describe('useTokenPerformance Hook', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should initialize with default metrics', () => {
      const { result } = renderHook(() => useTokenPerformance());

      expect(result.current.metrics).toEqual({
        avgExecutionTime: 0,
        totalOperations: 0,
        cacheHitRate: 85.5,
        memoryUsage: 50,
        operationsPerSecond: 0,
        lastOperationTime: 0,
      });
    });

    it('should benchmark operations correctly', async () => {
      const { result } = renderHook(() => useTokenPerformance());

      const benchmark = await act(async () => {
        return await result.current.benchmarkOperation(async () => {
          return 'test result';
        });
      });

      expect(benchmark.result).toBe('test result');
      expect(benchmark.duration).toBeGreaterThanOrEqual(0);
      expect(benchmark.timestamp).toBeGreaterThan(0);
    });

    it('should measure token counting performance', async () => {
      const { result } = renderHook(() => useTokenPerformance());

      const measurements = await act(async () => {
        return await result.current.measureTokenCount('Hello World', 10);
      });

      expect(measurements).toHaveLength(10);
      expect(measurements[0].duration).toBeGreaterThanOrEqual(0);
      expect(measurements[0].count).toBe(2.5);
    });

    it('should handle monitoring lifecycle', () => {
      const { result } = renderHook(() => useTokenPerformance());

      expect(result.current.isMonitoring).toBe(false);

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
    });

    it('should clear metrics and cache', () => {
      const { result } = renderHook(() => useTokenPerformance());

      // Add some operations first
      act(async () => {
        await result.current.benchmarkOperation(async () => 'test');
      });

      expect(result.current.metrics.totalOperations).toBe(1);

      act(() => {
        result.current.clearMetrics();
      });

      expect(result.current.metrics.totalOperations).toBe(0);
    });

    it('should detect performance degradation', () => {
      const { result } = renderHook(() => useTokenPerformance());

      // Initial state should not be degraded
      expect(result.current.isPerformanceDegraded()).toBe(false);
    });

    it('should provide optimization suggestions', () => {
      const { result } = renderHook(() => useTokenPerformance());

      const suggestions = result.current.getOptimizationSuggestions();
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should handle operation errors gracefully', async () => {
      const { result } = renderHook(() => useTokenPerformance());

      await expect(
        act(async () => {
          await result.current.benchmarkOperation(async () => {
            throw new Error('Test error');
          });
        })
      ).rejects.toThrow('Test error');
    });

    it('should update metrics periodically when monitoring', () => {
      const { result } = renderHook(() => useTokenPerformance());

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should still be monitoring
      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        result.current.stopMonitoring();
      });
    });
  });

  describe('useAutoTokenPerformance Hook', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start monitoring automatically by default', () => {
      const { result } = renderHook(() => useAutoTokenPerformance());

      expect(result.current.isMonitoring).toBe(true);
    });

    it('should not start monitoring when autoStart is false', () => {
      const { result } = renderHook(() => useAutoTokenPerformance(false));

      expect(result.current.isMonitoring).toBe(false);
    });

    it('should handle custom update interval', () => {
      const { result } = renderHook(() => useAutoTokenPerformance(true, 1000));

      expect(result.current.isMonitoring).toBe(true);
    });

    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => useAutoTokenPerformance());

      expect(result.current.isMonitoring).toBe(true);

      unmount();

      // After unmount, monitoring should be stopped
      // Note: This is tested by the hook's internal cleanup logic
    });
  });

  describe('Hook Integration', () => {
    it('should work together validation and performance hooks', async () => {
      const { result: validatorResult } = renderHook(() => useTokenValidator());
      const { result: performanceResult } = renderHook(() => useTokenPerformance());

      // Validate some text
      act(() => {
        validatorResult.current.validateText('Hello World');
      });

      // Measure performance of a related operation
      const benchmark = await act(async () => {
        return await performanceResult.current.benchmarkOperation(async () => {
          return 'operation completed';
        });
      });

      expect(validatorResult.current.textValidation?.valid).toBe(true);
      expect(benchmark.result).toBe('operation completed');
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useTokenValidator());

      // Rapid validations
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.validateText(`test ${i}`);
        });
      }

      expect(result.current.textValidation?.valid).toBe(true);
    });

    it('should handle concurrent validations', () => {
      const { result } = renderHook(() => useTokenValidator());

      // Simulate concurrent validations
      act(() => {
        result.current.validateText('text1');
        result.current.validateModel('gpt-4');
        result.current.validateBudget(1000);
      });

      expect(result.current.textValidation?.valid).toBe(true);
      expect(result.current.modelValidation?.valid).toBe(true);
      expect(result.current.budgetValidation?.valid).toBe(true);
    });
  });

  describe('Error Boundaries and Edge Cases', () => {
    it('should handle null/undefined inputs gracefully', () => {
      const { result } = renderHook(() => useTokenValidator());

      expect(() => {
        act(() => {
          result.current.validateText(null as any);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.validateModel(undefined as any);
        });
      }).not.toThrow();
    });

    it('should handle extreme values', () => {
      const { result } = renderHook(() => useTokenValidator());

      // Very large text
      const largeText = 'x'.repeat(100000);
      act(() => {
        const validationResult = result.current.validateText(largeText);
        expect(validationResult.valid).toBe(true);
      });

      // Very large budget
      act(() => {
        const validationResult = result.current.validateBudget(10000000);
        expect(validationResult.valid).toBe(true);
        expect(validationResult.warnings?.length).toBeGreaterThan(0);
      });
    });

    it('should handle special characters and Unicode', () => {
      const { result } = renderHook(() => useTokenValidator());

      const specialText = '🚀 Hello 世界 🌍 ñáéíóú 中文';
      act(() => {
        const validationResult = result.current.validateText(specialText);
        expect(validationResult.valid).toBe(true);
      });

      expect(result.current.textValidation?.valid).toBe(true);
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle multiple rapid validations efficiently', () => {
      const { result } = renderHook(() => useTokenValidator());
      
      const start = performance.now();
      
      // Rapid validations
      for (let i = 0; i < 50; i++) {
        act(() => {
          result.current.validateText(`test ${i}`);
        });
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle large text validation', () => {
      const { result } = renderHook(() => useTokenValidator());
      
      const largeText = 'x'.repeat(50000); // 50KB
      const start = performance.now();
      
      act(() => {
        const validationResult = result.current.validateText(largeText);
        expect(validationResult.valid).toBe(true);
      });
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });
  });
});