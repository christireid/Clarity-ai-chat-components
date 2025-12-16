# Token Optimization Consolidation Action Plan

## Immediate Actions (Priority 1)

### 1. Fix Critical Syntax Errors

**File**: `packages/react/src/utils/tokenization/index.ts`

**Issues to fix**:
```typescript
// Line 52-53: Remove duplicate export and fix syntax
// BEFORE:
export type { TokenUsageEvent, TokenAnalytics, TokenMetrics }
export type { TokenMetrics,  // Syntax error - duplicate with comma

// AFTER:
export type { TokenUsageEvent, TokenAnalytics, TokenMetrics } from './token-analytics.js';
```

**File**: `packages/react/src/utils/tokenization/index.ts`

**Remove duplicate exports** (lines 100-115):
```typescript
// Remove entire duplicate block starting at line 100
// Advanced compression techniques (duplicated)
export {
  LLMLinguaCompressor,
  AdvancedCompressionOrchestrator,
  // ... all duplicated exports
} from './advanced-compression.js';
```

### 2. Fix Missing Imports

**Add missing import for `recordTokenUsage`**:
```typescript
// Add to imports in token-analytics.js section
import { recordTokenUsage } from './token-analytics.js';
```

### 3. Consolidate Performance Hooks

**Create unified performance hook**:

**File**: `packages/react/src/hooks/performance/use-performance-enhanced.tsx`
```typescript
import { usePerformance, UsePerformanceOptions } from './use-performance';
import { useTokenPerformance, TokenPerformanceMetrics } from '../token/use-token-performance';

export interface UseEnhancedPerformanceOptions extends UsePerformanceOptions {
  tokenSpecific?: boolean;
  tokenMetrics?: Partial<TokenPerformanceMetrics>;
}

export function useEnhancedPerformance(options?: UseEnhancedPerformanceOptions) {
  const basePerformance = usePerformance(options);
  
  if (options?.tokenSpecific) {
    const tokenPerformance = useTokenPerformance();
    return {
      ...basePerformance,
      tokenMetrics: tokenPerformance.metrics,
      benchmarkTokenOperation: tokenPerformance.benchmarkOperation,
      isTokenPerformanceDegraded: tokenPerformance.isPerformanceDegraded,
    };
  }
  
  return basePerformance;
}
```

## Strategic Consolidation (Priority 2)

### 1. Unified Compression API

**File**: `packages/react/src/utils/optimization/compression-unified.ts`

```typescript
import { compressPrompt, CompressionOptions, CompressionResult } from './prompt-compression';
import { compressText, CompressionConfig } from '../tokenization/text-compression';
import { compressWithLLMLingua, LLMLinguaCompressor } from './llmlingua-compressor';

export type CompressionStrategy = 'prompt' | 'text' | 'semantic' | 'llmlingua' | 'adaptive';

export interface UnifiedCompressionOptions {
  strategy: CompressionStrategy;
  targetRatio?: number;
  preserveContext?: boolean;
  qualityThreshold?: number;
  model?: string;
}

export interface UnifiedCompressionResult extends CompressionResult {
  strategy: CompressionStrategy;
  qualityScore: number;
  performanceImpact: number;
  recommended: boolean;
}

export function compressUnified(
  content: string,
  options: UnifiedCompressionOptions
): UnifiedCompressionResult {
  const startTime = performance.now();
  
  let result: CompressionResult;
  let qualityScore = 1.0;
  
  switch (options.strategy) {
    case 'prompt':
      result = compressPrompt(content, {
        targetRatio: options.targetRatio,
        preserveContext: options.preserveContext
      });
      break;
      
    case 'text':
      // Delegate to existing text compression
      result = compressText(content, {
        targetRatio: options.targetRatio,
        qualityThreshold: options.qualityThreshold
      });
      break;
      
    case 'llmlingua':
      const compressor = new LLMLinguaCompressor({
        targetRatio: options.targetRatio
      });
      result = compressor.compress(content);
      qualityScore = 0.9; // LLMLingua maintains good quality
      break;
      
    default:
      throw new Error(`Unsupported compression strategy: ${options.strategy}`);
  }
  
  const processingTime = performance.now() - startTime;
  
  return {
    ...result,
    strategy: options.strategy,
    qualityScore,
    performanceImpact: processingTime,
    recommended: result.compressionRatio > 0.3 && qualityScore > 0.7
  };
}
```

### 2. Enhanced Token Components

**File**: `packages/react/src/components/token/token-counter-enhanced.tsx`

```typescript
import React from 'react';
import { TokenCounter, TokenCounterProps } from './token-counter';
import { TokenCostPreview } from './TokenCostPreview';
import { TokenUsageMeter } from './token-usage-meter';
import { useTokenOptimizationEnhanced } from '../../hooks/token/use-token-optimization-enhanced';

export interface EnhancedTokenCounterProps extends TokenCounterProps {
  showCostPreview?: boolean;
  showUsageMeter?: boolean;
  showModelComparison?: boolean;
  enableOptimization?: boolean;
  onOptimization?: (result: OptimizationResult) => void;
}

export const EnhancedTokenCounter: React.FC<EnhancedTokenCounterProps> = ({
  showCostPreview = false,
  showUsageMeter = false,
  showModelComparison = false,
  enableOptimization = false,
  onOptimization,
  ...baseProps
}) => {
  const { optimize } = useTokenOptimizationEnhanced();
  
  const handleOptimization = async () => {
    if (enableOptimization && baseProps.text) {
      const result = await optimize(baseProps.text);
      onOptimization?.(result);
    }
  };
  
  return (
    <div className="enhanced-token-counter">
      <TokenCounter {...baseProps} />
      
      {showCostPreview && (
        <TokenCostPreview
          text={baseProps.text || ''}
          model={baseProps.model || 'gpt-4'}
        />
      )}
      
      {showUsageMeter && (
        <TokenUsageMeter
          usage={{
            current: baseProps.currentTokens,
            max: baseProps.maxTokens,
            model: baseProps.model || 'gpt-4'
          }}
        />
      )}
      
      {enableOptimization && (
        <button onClick={handleOptimization} className="optimize-button">
          Optimize Tokens
        </button>
      )}
    </div>
  );
};
```

### 3. Consolidated Hook Pattern

**File**: `packages/react/src/hooks/token/use-token-optimization-consolidated.tsx`

```typescript
import { useState, useCallback, useMemo } from 'react';
import { useTokenOptimizationEnhanced } from './use-token-optimization-enhanced';
import { useTokenBudgetMonitor } from './use-token-budget-monitor';
import { useTokenTracker } from './use-token-tracker';
import { compressUnified, CompressionStrategy } from '../../utils/optimization/compression-unified';
import { validateTokenBudget, TokenBudget } from '../../utils/tokenization';

export interface ConsolidatedTokenOptions {
  enableOptimization?: boolean;
  enableCompression?: boolean;
  enableBudgetMonitoring?: boolean;
  enableTracking?: boolean;
  compressionStrategy?: CompressionStrategy;
  budget?: TokenBudget;
}

export interface ConsolidatedTokenReturn {
  // Core functionality
  count: (text: string) => Promise<number>;
  optimize: (text: string) => Promise<string>;
  compress: (text: string, strategy?: CompressionStrategy) => Promise<string>;
  
  // Monitoring
  isWithinBudget: (text: string) => boolean;
  getTokenUsage: () => TokenUsage;
  
  // State
  isProcessing: boolean;
  error: Error | null;
  
  // Analytics
  compressionRatio: number;
  tokensSaved: number;
  performance: PerformanceMetrics;
}

export function useTokenOptimizationConsolidated(
  options: ConsolidatedTokenOptions = {}
): ConsolidatedTokenReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [compressionRatio, setCompressionRatio] = useState(1);
  const [tokensSaved, setTokensSaved] = useState(0);
  
  const enhanced = useTokenOptimizationEnhanced();
  const budgetMonitor = useTokenBudgetMonitor(options.budget ? { budget: options.budget } : undefined);
  const tracker = useTokenTracker();
  
  const count = useCallback(async (text: string): Promise<number> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const count = await enhanced.countTokens(text);
      tracker.track(count);
      return count;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Counting failed'));
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [enhanced, tracker]);
  
  const optimize = useCallback(async (text: string): Promise<string> => {
    if (!options.enableOptimization) return text;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const originalCount = await count(text);
      const optimized = await enhanced.optimize(text);
      const optimizedCount = await count(optimized);
      
      const saved = originalCount - optimizedCount;
      setTokensSaved(prev => prev + saved);
      
      return optimized;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Optimization failed'));
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [enhanced, count, options.enableOptimization]);
  
  const compress = useCallback(async (
    text: string, 
    strategy: CompressionStrategy = options.compressionStrategy || 'text'
  ): Promise<string> => {
    if (!options.enableCompression) return text;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const originalCount = await count(text);
      const result = compressUnified(text, { strategy });
      setCompressionRatio(result.compressionRatio);
      
      return result.compressedContent;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Compression failed'));
      return text;
    } finally {
      setIsProcessing(false);
    }
  }, [count, options.enableCompression, options.compressionStrategy]);
  
  const isWithinBudget = useCallback((text: string): boolean => {
    if (!options.enableBudgetMonitoring || !options.budget) return true;
    return validateTokenBudget(text, options.budget).isValid;
  }, [options.enableBudgetMonitoring, options.budget]);
  
  return {
    count,
    optimize,
    compress,
    isWithinBudget,
    getTokenUsage: () => tracker.getUsage(),
    isProcessing,
    error,
    compressionRatio,
    tokensSaved,
    performance: enhanced.performance || { avgExecutionTime: 0, totalOperations: 0 }
  };
}
```

## Testing Consolidation

**File**: `packages/react/src/hooks/token/__tests__/use-token-optimization-consolidated.test.tsx`

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useTokenOptimizationConsolidated } from '../use-token-optimization-consolidated';

describe('useTokenOptimizationConsolidated', () => {
  it('should provide consolidated token optimization functionality', async () => {
    const { result } = renderHook(() => 
      useTokenOptimizationConsolidated({
        enableOptimization: true,
        enableCompression: true,
        enableBudgetMonitoring: true
      })
    );
    
    expect(result.current.count).toBeDefined();
    expect(result.current.optimize).toBeDefined();
    expect(result.current.compress).toBeDefined();
    expect(result.current.isWithinBudget).toBeDefined();
  });
  
  it('should optimize text and track savings', async () => {
    const { result } = renderHook(() => 
      useTokenOptimizationConsolidated({
        enableOptimization: true
      })
    );
    
    const testText = "This is a test text that should be optimized";
    
    await act(async () => {
      const optimized = await result.current.optimize(testText);
      expect(optimized).toBeTruthy();
      expect(result.current.tokensSaved).toBeGreaterThan(0);
    });
  });
  
  it('should compress text with specified strategy', async () => {
    const { result } = renderHook(() => 
      useTokenOptimizationConsolidated({
        enableCompression: true
      })
    );
    
    const testText = "This text should be compressed";
    
    await act(async () => {
      const compressed = await result.current.compress(testText, 'text');
      expect(compressed).toBeTruthy();
      expect(result.current.compressionRatio).toBeLessThan(1);
    });
  });
});
```

## Migration Guide

### Step 1: Update Existing Code

**Before**:
```typescript
// Using separate hooks
const { optimize } = useTokenOptimizationEnhanced();
const { isWithinBudget } = useTokenBudgetMonitor();
const { track } = useTokenTracker();
```

**After**:
```typescript
// Using consolidated hook
const { optimize, isWithinBudget, count } = useTokenOptimizationConsolidated({
  enableOptimization: true,
  enableBudgetMonitoring: true,
  enableTracking: true
});
```

### Step 2: Component Updates

**Before**:
```typescript
// Multiple components
<TokenCounter text={text} model={model} />
<TokenCostPreview text={text} model={model} />
<TokenUsageMeter usage={usage} />
```

**After**:
```typescript
// Single enhanced component
<EnhancedTokenCounter
  text={text}
  model={model}
  showCostPreview={true}
  showUsageMeter={true}
  enableOptimization={true}
/>
```

### Step 3: Compression Updates

**Before**:
```typescript
// Multiple compression functions
const compressed1 = compressPrompt(text, options);
const compressed2 = compressText(text, config);
const compressed3 = compressWithLLMLingua(text, config);
```

**After**:
```typescript
// Unified compression
const result = compressUnified(text, {
  strategy: 'prompt', // or 'text', 'semantic', 'llmlingua'
  targetRatio: 0.5,
  preserveContext: true
});
```

## Success Metrics

### Code Quality Metrics
- **Duplication Reduction**: 80% fewer duplicate functions
- **Bundle Size**: 25% reduction in bundle size
- **Type Safety**: 100% TypeScript coverage maintained
- **Test Coverage**: 95% test coverage maintained

### Performance Metrics
- **Memory Usage**: 30% reduction in memory footprint
- **Runtime Performance**: 15% improvement in execution speed
- **API Response Time**: 20% faster API responses
- **Compression Efficiency**: 10% better compression ratios

### Developer Experience
- **API Simplicity**: 50% reduction in API surface area
- **Learning Curve**: 40% faster onboarding time
- **Code Reusability**: 3x increase in code reuse
- **Documentation**: 100% API documentation coverage

## Risk Mitigation

### Compatibility Layer
```typescript
// Maintain backward compatibility
export const useTokenPerformance = (options?: UseTokenPerformanceOptions) => {
  return useEnhancedPerformance({ ...options, tokenSpecific: true });
};

export const compressText = (text: string, config: CompressionConfig) => {
  return compressUnified(text, { strategy: 'text', ...config });
};
```

### Gradual Migration
1. **Phase 1**: Introduce new consolidated APIs alongside existing ones
2. **Phase 2**: Mark old APIs as deprecated with migration warnings
3. **Phase 3**: Remove old APIs in next major version

### Testing Strategy
- **Parallel Testing**: Run old and new implementations side-by-side
- **Regression Testing**: Ensure no functionality is lost
- **Performance Testing**: Verify performance improvements
- **Integration Testing**: Test with existing integrations

This action plan provides a clear path from the current fragmented implementation to a unified, efficient token optimization system while maintaining compatibility and minimizing risk.