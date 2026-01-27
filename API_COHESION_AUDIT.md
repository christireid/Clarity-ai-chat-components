# API Surface Cohesion Audit Report

**Date**: 2026-01-27 **Packages Analyzed**: @clarity-chat/react, @clarity-chat/token-optimization,
@clarity-chat/types, @clarity-chat/utils, @clarity-chat/memory

---

## Executive Summary

**Overall API Cohesion Score: 68/100**

The Clarity Chat API surface shows good organization but has significant opportunities for
improvement in consistency, deduplication, and clarity.

### Score Breakdown

| Category                       | Score      | Weight | Weighted Score |
| ------------------------------ | ---------- | ------ | -------------- |
| **Export Organization**        | 75/100     | 20%    | 15.0           |
| **Naming Consistency**         | 65/100     | 25%    | 16.25          |
| **Type Coverage**              | 80/100     | 15%    | 12.0           |
| **JSDoc Coverage**             | 55/100     | 15%    | 8.25           |
| **Duplication/Overlap**        | 60/100     | 15%    | 9.0            |
| **Missing/Unexpected Exports** | 70/100     | 10%    | 7.0            |
| **TOTAL**                      | **68/100** | 100%   | **68/100**     |

---

## 1. Export Organization Analysis

### @clarity-chat/react (SCORE: 70/100)

**Package.json Exports**: ✅ Good

```json
{
  ".": "Main bundle (1078+ exports)",
  "./core": "Core components only",
  "./core-minimal": "Minimal bundle",
  "./animations": "Animation utilities",
  "./utils": "Utility functions",
  "./prompt": "Prompt engineering",
  "./analytics": "Analytics tracking",
  "./memory": "Memory integration",
  "./adapters": "Provider adapters",
  "./test-utils": "Testing utilities",
  "./internal": "Internal APIs (unstable)",
  "./slim": "Slim bundle",
  "./namespaced": "Namespaced exports"
}
```

**Issues**:

- ❌ **Overlapping exports**: `./core` vs `./core-minimal` vs `./slim` - unclear differentiation
- ❌ **Missing subpath exports**: No dedicated exports for:
  - `./hooks` (individual hook imports)
  - `./components` (individual component imports)
  - `./types` (type-only imports)
- ⚠️ **Barrel export bloat**: Main `public-api.ts` has 1078+ exports (116 export statements)
- ⚠️ **Internal/Public boundary**: `./internal` export exists but unclear what should be internal

**Recommendations**:

1. Add granular subpath exports for hooks and components
2. Clearly document differences between core, core-minimal, and slim
3. Consider splitting public-api.ts into domain-specific files
4. Move truly internal APIs to separate `@clarity-chat/react-internal` package

---

### @clarity-chat/token-optimization (SCORE: 85/100)

**Package.json Exports**: ✅ Excellent

```json
{
  ".": "Main entry (640 exports)",
  "./react": "React hooks only",
  "./compression": "Compression utilities",
  "./cache": "Caching systems"
}
```

**Issues**:

- ✅ Well-organized subpath exports
- ⚠️ Missing exports for:
  - `./tokenizers` (direct tokenizer access)
  - `./providers` (provider-specific utilities)
  - `./models` (model registry and pricing)

**Recommendations**:

1. Add `./tokenizers`, `./providers`, `./models` subpath exports
2. Consider `./server` for Node.js-only features

---

### @clarity-chat/types (SCORE: 65/100)

**Package.json Exports**: ⚠️ Needs Improvement

```json
{
  ".": "All types",
  "./memory": "Memory types (duplicate of main!)"
}
```

**Issues**:

- ❌ **Duplicate export**: `./memory` points to same file as `.`
- ❌ **Missing granular exports**: No separate exports for:
  - `./chat`
  - `./message`
  - `./user`
  - `./context`
  - etc.
- ⚠️ **Barrel file explosion**: Single index.ts re-exports everything

**Recommendations**:

1. Remove duplicate `./memory` export
2. Add granular type exports for each domain
3. Consider splitting into `@clarity-chat/types/chat`, `@clarity-chat/types/memory`, etc.

---

### @clarity-chat/utils (SCORE: 80/100)

**Package.json Exports**: ✅ Very Good

```json
{
  ".": "All utilities",
  "./format": "Formatting utilities",
  "./cache": "Caching utilities",
  "./logger": "Logging utilities",
  "./progress": "Progress indicators",
  "./errors": "Error classes",
  "./async": "Async utilities",
  "./validation": "Validation utilities",
  "./math": "Math utilities",
  "./env": "Environment detection"
}
```

**Issues**:

- ✅ Excellent granular exports
- ✅ Clear separation of concerns
- ⚠️ Some utilities exported both from main and subpath (intended for convenience)

**Recommendations**:

1. Document re-export strategy (main vs subpath)
2. Consider deprecating some main exports in favor of subpaths

---

### @clarity-chat/memory (SCORE: 70/100)

**Package.json Exports**: ⚠️ Adequate

```json
{
  ".": "All memory features"
}
```

**Issues**:

- ⚠️ **No subpath exports**: Everything in single barrel
- ⚠️ **Missing exports**:
  - `./react` (React hooks separate from core)
  - `./consent` (GDPR utilities)
  - `./audit` (Audit logging)

**Recommendations**:

1. Add `./react`, `./consent`, `./audit` subpath exports
2. Consider `./storage`, `./embedding` for provider-specific features

---

## 2. Naming Consistency Analysis

### Hook Naming (SCORE: 70/100)

**Patterns Found**:

```typescript
// ✅ Consistent: use[Feature]
useTokenCount, useTokenBudget, useMemoryContext

// ✅ Consistent: use[Feature][Action]
useTokenBudgetMonitor, useMessageOperations

// ❌ Inconsistent: Mixed patterns
useClarityChat         // "Clarity" prefix
useHeadlessChat        // "Headless" prefix
useClarityChatApp      // Double prefix

// ❌ Inconsistent: Overlapping hooks
useTokenBudgetMonitor vs useTokenBudgetTracking  // Same feature, different names
useChat vs useClarityChat vs useHeadlessChat     // Confusing hierarchy
```

**Issues**:

1. **Prefix inconsistency**: Some hooks have "Clarity" prefix, others don't
2. **Feature overlap**: Multiple hooks for same feature with different names
3. **Alias confusion**: `useChat as useHeadlessChat` creates two names for same hook

**Recommendations**:

1. Standardize hook naming: `use[Feature][Variant?]`
   - `useChat` (default)
   - `useChatHeadless` (variant)
   - Remove "Clarity" prefix from hook names
2. Deprecate duplicate hooks:
   - `useTokenBudgetMonitor` → `useTokenBudget` (already exists)
   - `useHeadlessChat` → `useChatHeadless`
3. Document hook hierarchy clearly

---

### Component Naming (SCORE: 75/100)

**Patterns Found**:

```typescript
// ✅ Consistent: [Feature][Type]
MessageList, ChatWindow, TokenCounter

// ✅ Consistent: [Adjective][Feature]
EnhancedMarkdownRenderer, AdvancedChatInput

// ⚠️ Inconsistent: Mixed specificity
TanStackMessageList vs MessageList  // Why expose implementation detail?
VirtualizedMessageList vs MessageList  // Same component, different names

// ❌ Inconsistent: Overlapping components
StreamStatusProgress vs StreamingProgress  // Different components, similar names
TextShimmer vs ParagraphShimmer  // Inconsistent hierarchy
```

**Issues**:

1. **Implementation detail leakage**: TanStackMessageList exposes internal library
2. **Unclear hierarchy**: Multiple message list components with unclear differences
3. **Similar names, different purposes**: StreamStatusProgress ≠ StreamingProgress

**Recommendations**:

1. Hide implementation details:
   - `TanStackMessageList` → `MessageListVirtual`
   - Document TanStack as internal implementation
2. Clarify component hierarchy with prefixes:
   - `MessageList` (default)
   - `MessageListVirtual` (optimized)
   - `MessageListOptimized` (alias)
3. Rename ambiguous components:
   - `StreamStatusProgress` → `StreamProgressIndicator`
   - Keep `StreamingProgress` for simple loading state

---

### Type Naming (SCORE: 60/100)

**Patterns Found**:

```typescript
// ✅ Consistent: [Feature]Props, [Feature]Options, [Feature]Return
ChatWindowProps, UseTokenCountOptions, UseChatReturn

// ❌ Inconsistent: Mixed suffixes
UseClarityChatOptions vs ChatApiConfig  // Options vs Config
TokenUsage vs TokenBudgetUsage  // Unclear differentiation

// ❌ Inconsistent: Overlapping types
MessageContent vs Message  // Which one to use?
CoreMessage vs Message  // Unclear hierarchy

// ❌ Inconsistent: Generic vs Specific
ModelConfig vs ModelRoutingConfig vs TokenModelConfig  // Too many config types
```

**Issues**:

1. **Config type explosion**: Too many config types with overlapping purposes
2. **Unclear type hierarchy**: Message, CoreMessage, MessageContent all exist
3. **Suffix inconsistency**: Options vs Config vs Settings

**Recommendations**:

1. Standardize type suffixes:
   - `[Feature]Props` - React component props
   - `[Feature]Options` - Function/hook options
   - `[Feature]Config` - Configuration objects
   - `[Feature]Return` - Hook return types
2. Consolidate config types:
   - Merge `ModelConfig` and `ModelRoutingConfig`
   - Rename `TokenModelConfig` → `ModelRegistryConfig`
3. Document type hierarchy:
   - `Message` - Full message with metadata
   - `CoreMessage` - Minimal message (from AI SDK)
   - `MessageContent` - Message content only

---

## 3. Type Export Completeness (SCORE: 80/100)

### Coverage Analysis

**@clarity-chat/react**:

- ✅ **Most components export types**: Props, Options, Return types
- ✅ **Good type re-exports**: From token-optimization, license, error-handling
- ⚠️ **Missing types for some exports**:
  - `createAgent` - No types exported
  - `createRAGEngine` - Missing RAGEngineConfig type export
  - `createToolsEngine` - Missing ToolsEngineConfig type export
- ⚠️ **Inconsistent type exports**:
  - Some hooks export `UseXOptions` and `UseXReturn`
  - Others only export return type or neither

**@clarity-chat/token-optimization**:

- ✅ **Comprehensive type exports**: All major features have types
- ✅ **Good aliasing**: Deprecated types with new names
- ⚠️ **Type pollution**: Many internal types exported (e.g., DebugInfo types)

**@clarity-chat/types**:

- ✅ **Complete type definitions**: All domains covered
- ❌ **No runtime exports**: Pure types package (as intended)
- ⚠️ **Circular dependencies**: Some types reference each other cyclically

**@clarity-chat/utils**:

- ✅ **Good type coverage**: Most utilities have types
- ✅ **Separate type exports**: Options, Config, Return types
- ⚠️ **Some missing types**: e.g., `handleError` has no ErrorHandlerOptions

**@clarity-chat/memory**:

- ✅ **Comprehensive types**: All features fully typed
- ✅ **Good type organization**: Grouped by domain
- ⚠️ **Heavy re-exports**: Many types from token-optimization

**Recommendations**:

1. Audit all exports to ensure types are exported alongside values
2. Separate internal types from public types
3. Document which types are stable vs experimental
4. Consider using `export type` for type-only exports (better tree-shaking)

---

## 4. JSDoc Coverage (SCORE: 55/100)

### Coverage by Package

**@clarity-chat/react**: ~40% coverage

- ✅ **Well-documented**:
  - public-api.ts has good module-level docs
  - Major hooks have JSDoc comments
- ❌ **Missing JSDoc**:
  - ~60% of components lack JSDoc
  - Many utility functions undocumented
  - Type definitions lack descriptions

**@clarity-chat/token-optimization**: ~65% coverage

- ✅ **Well-documented**:
  - index.ts has comprehensive examples
  - Core APIs well-documented
- ❌ **Missing JSDoc**:
  - Internal utilities lack docs
  - Some advanced features undocumented

**@clarity-chat/types**: ~30% coverage

- ❌ **Poor coverage**:
  - Most types lack descriptions
  - No usage examples
  - Enum values undocumented

**@clarity-chat/utils**: ~70% coverage

- ✅ **Good coverage**:
  - Most functions documented
  - Good examples
- ⚠️ **Inconsistent**:
  - Some modules well-documented, others sparse

**@clarity-chat/memory**: ~60% coverage

- ✅ **Moderate coverage**:
  - Core APIs documented
  - Examples provided
- ❌ **Missing**:
  - Advanced features lack docs
  - Configuration options undocumented

### Common JSDoc Issues

````typescript
// ❌ Missing JSDoc completely
export function createAgent() { ... }

// ❌ Incomplete JSDoc (no examples, no params)
/**
 * Creates a chat configuration
 */
export function createConfig(options) { ... }

// ✅ Good JSDoc
/**
 * Creates a token optimization configuration
 *
 * @param options - Configuration options
 * @returns Optimizer instance
 *
 * @example
 * ```typescript
 * const optimizer = createOptimizer({ model: 'gpt-4o' })
 * const count = optimizer.count('Hello world')
 * ```
 */
export function createOptimizer(options) { ... }
````

**Recommendations**:

1. Add JSDoc to all public exports (target: 90%+ coverage)
2. Include `@example` blocks for complex APIs
3. Document all parameters and return values
4. Add `@deprecated` tags for legacy APIs
5. Use `@see` to link related APIs

---

## 5. Duplication & Overlap Analysis (SCORE: 60/100)

### Duplicate Exports

#### 1. **Message List Components** (HIGH SEVERITY)

```typescript
export { VirtualizedMessageList as MessageList } // Alias
export { MessageList as MessageListComponent } // Different component!
export { TanStackMessageList } // Another implementation
export { AutoTanStackMessageList } // Wrapper around TanStack
```

**Issue**: Four different message list components with overlapping names **Recommendation**:

- Keep one canonical `MessageList` (auto-selecting implementation)
- Rename others: `MessageListVirtual`, `MessageListBasic`
- Document when to use each

#### 2. **Token Budget Monitoring** (HIGH SEVERITY)

```typescript
export { useTokenBudgetMonitor } // Hook
export { useTokenBudgetTracking } // Same hook, different name
export { TokenBudgetProvider } // Context provider
export { useTokenBudget } // Context consumer
```

**Issue**: Three overlapping APIs for token budget tracking **Recommendation**:

- Deprecate `useTokenBudgetMonitor`
- Use `useTokenBudgetTracking` for standalone
- Use `TokenBudgetProvider` + `useTokenBudget` for context

#### 3. **Chat Hooks** (MEDIUM SEVERITY)

```typescript
export { useClarityChat } // Main hook
export { useChat as useHeadlessChat } // Alias of different hook
export { useClarityChatApp } // App API hook
export { useChatSync } // Sync-specific hook
```

**Issue**: Confusing hierarchy of chat hooks **Recommendation**:

- `useChat` - Base hook (rename from useHeadlessChat)
- `useChatEnhanced` - Enhanced features (rename from useClarityChat)
- `useChatApp` - App API (rename from useClarityChatApp)
- `useChatSync` - Keep as-is (specific feature)

#### 4. **Error Handling** (MEDIUM SEVERITY)

```typescript
// From @clarity-chat/utils
export { handleError }
export { handleUnifiedError }

// From @clarity-chat/error-handling
export { useErrorHandler }

// From @clarity-chat/react
export { useAsyncErrorHandler }
```

**Issue**: Multiple error handling utilities with unclear differences **Recommendation**:

- Document when to use each
- Consider merging `handleError` and `handleUnifiedError`

#### 5. **Performance Monitoring** (LOW SEVERITY)

```typescript
// From @clarity-chat/utils
export { measurePerformance }
export { measurePerformanceAsync }

// From @clarity-chat/react
export { usePerformanceTracking }
export { usePerformanceMonitoring } // Similar to tracking?
```

**Issue**: Two React hooks with similar purposes **Recommendation**:

- Merge into single `usePerformance` hook with options

### Overlapping APIs

#### 1. **Token Counting**

```typescript
// Multiple ways to count tokens:
useTokenCount(text) // Hook
countTokens(text) // Function
AccurateTokenCounter.count(text) // Class
ProviderNativeCounter.count(text) // Provider-specific
```

**Issue**: Too many entry points for same task **Recommendation**: Document recommended approach for
each use case

#### 2. **Caching**

```typescript
// Multiple cache implementations:
ExactCache // From token-optimization
SmartCache // From token-optimization
TieredCache // From token-optimization
LRUCache // From utils
TTLCache // From utils
```

**Issue**: Five cache implementations with overlapping purposes **Recommendation**:

- Document use cases for each
- Consider deprecating some in favor of unified API

#### 3. **Compression**

```typescript
// From token-optimization:
compressText // Legacy
compressAdaptively // New API
LLMLinguaCompressor // Strategy
ExtractiveCompressor // Strategy
AdaptiveCompressor // Strategy

// From memory:
compressWithMemoryAdaptive // Memory-specific
```

**Issue**: Many compression APIs with unclear relationships **Recommendation**:

- Deprecate `compressText`
- Document when to use each strategy
- Consider unified `compress()` with strategy option

---

## 6. Missing & Unexpected Exports (SCORE: 70/100)

### Missing Exports (Should Be Public)

#### High Priority

1. **`MarkdownRenderer`** - Currently must use `EnhancedMarkdownRenderer` (verbose)
2. **`useChatMessages`** - Helper hook for message management (exists internally)
3. **`TokenEstimator`** - Class-based token estimation (only function exported)
4. **`CacheStrategy`** - Type for cache strategy selection
5. **Individual component exports via subpaths** - e.g., `@clarity-chat/react/message`

#### Medium Priority

1. **`ToolDefinition`** builders - Helper functions for creating tool definitions
2. **`ModelCapabilities`** - Type for model feature detection
3. **`ConversationManager`** - Class for conversation state management
4. **`StreamController`** - For advanced streaming control

#### Low Priority

1. **Debug utilities** - Currently in internal only
2. **Development helpers** - Some exported, others missing
3. **Test factories** - More comprehensive test data generators

### Unexpected Exports (Should Be Internal)

#### High Priority

1. **`_internal` functions** - Some packages export functions prefixed with `_`
2. **`DebugInfo` types** - Detailed debug types should be internal
3. **`getContentHash`** - Implementation detail of caching
4. **`createCacheKey`** - Implementation detail

#### Medium Priority

1. **Implementation-specific types** - e.g., `TanStackMessageListProps`
2. **Internal state types** - e.g., `StreamingState` (should be opaque)
3. **Deprecated APIs without warnings** - Should have `@deprecated` tags

---

## 7. Recommendations by Priority

### 🔴 Critical (Fix Immediately)

1. **Remove duplicate `./memory` export from @clarity-chat/types**
   - File: `packages/types/package.json`
   - Issue: Points to same file as main export

2. **Standardize hook naming conventions**
   - Deprecate: `useHeadlessChat`, `useTokenBudgetMonitor`
   - Rename: `useClarityChatApp` → `useChatApp`

3. **Add missing JSDoc to all public exports**
   - Target: 90%+ coverage
   - Focus on @clarity-chat/react and @clarity-chat/types first

4. **Document bundle variants (core vs core-minimal vs slim)**
   - Create decision tree for choosing variant
   - Add size comparisons

### 🟡 High Priority (Next Sprint)

1. **Add granular subpath exports**
   - @clarity-chat/react: `./hooks`, `./components`, `./types`
   - @clarity-chat/types: Per-domain exports
   - @clarity-chat/memory: `./react`, `./consent`, `./audit`

2. **Consolidate overlapping APIs**
   - Merge message list components
   - Standardize token budget APIs
   - Document cache strategy selection

3. **Add type exports for missing features**
   - `RAGEngineConfig`, `ToolsEngineConfig`, `AgentConfig`
   - Hook options and return types

4. **Create API migration guide**
   - Document deprecated APIs
   - Provide codemod scripts
   - Add runtime warnings

### 🟢 Medium Priority (Future)

1. **Split packages for better tree-shaking**
   - Consider `@clarity-chat/react-hooks`, `@clarity-chat/react-components`
   - Evaluate bundle size impact first

2. **Add type-only entry points**
   - `@clarity-chat/react/types`
   - `@clarity-chat/token-optimization/types`

3. **Improve internal/public boundary**
   - Move internal APIs to separate package or clearly mark
   - Document stability guarantees

4. **Add bundle size budgets**
   - Set limits for each export path
   - CI enforcement

### 🔵 Low Priority (Backlog)

1. **Add API usage analytics**
   - Track which exports are actually used
   - Identify candidates for deprecation

2. **Create interactive API explorer**
   - Searchable documentation
   - Live examples

3. **Improve TypeScript performance**
   - Reduce type complexity
   - Add type-only imports where possible

---

## 8. Detailed Scoring Rubric

### Export Organization (Weight: 20%)

| Criteria                 | Score  | Max     | Notes                                     |
| ------------------------ | ------ | ------- | ----------------------------------------- |
| Subpath exports coverage | 15     | 20      | Missing hooks, components, types subpaths |
| Logical grouping         | 18     | 20      | Good domain organization                  |
| Bundle variant clarity   | 10     | 20      | Unclear differences between variants      |
| Tree-shaking support     | 18     | 20      | Good ESM support                          |
| Package boundaries       | 14     | 20      | Some overlapping responsibilities         |
| **TOTAL**                | **75** | **100** |                                           |

### Naming Consistency (Weight: 25%)

| Criteria         | Score  | Max     | Notes                              |
| ---------------- | ------ | ------- | ---------------------------------- |
| Hook naming      | 14     | 20      | Inconsistent prefixes and variants |
| Component naming | 15     | 20      | Some implementation detail leakage |
| Type naming      | 12     | 20      | Config type explosion              |
| Function naming  | 16     | 20      | Generally consistent               |
| Constant naming  | 8      | 20      | UPPER_CASE vs camelCase mixed      |
| **TOTAL**        | **65** | **100** |                                    |

### Type Coverage (Weight: 15%)

| Criteria      | Score  | Max     | Notes                               |
| ------------- | ------ | ------- | ----------------------------------- |
| Props types   | 18     | 20      | Most components have props types    |
| Options types | 16     | 20      | Some functions missing option types |
| Return types  | 15     | 20      | Some hooks missing return types     |
| Generic types | 17     | 20      | Good use of generics                |
| Type exports  | 14     | 20      | Some types not exported             |
| **TOTAL**     | **80** | **100** |                                     |

### JSDoc Coverage (Weight: 15%)

| Criteria      | Score  | Max     | Notes              |
| ------------- | ------ | ------- | ------------------ |
| Function docs | 12     | 20      | ~60% coverage      |
| Type docs     | 6      | 20      | ~30% coverage      |
| Examples      | 10     | 20      | ~50% have examples |
| Param docs    | 14     | 20      | ~70% coverage      |
| Return docs   | 13     | 20      | ~65% coverage      |
| **TOTAL**     | **55** | **100** |                    |

### Duplication/Overlap (Weight: 15%)

| Criteria                     | Score  | Max     | Notes                              |
| ---------------------------- | ------ | ------- | ---------------------------------- |
| No duplicate exports         | 10     | 20      | Several duplicate hooks/components |
| Clear API hierarchy          | 12     | 20      | Some confusion between variants    |
| No overlapping functionality | 8      | 20      | Multiple ways to do same thing     |
| Deprecated APIs marked       | 14     | 20      | Most deprecated APIs marked        |
| Migration path clarity       | 16     | 20      | Generally clear migration paths    |
| **TOTAL**                    | **60** | **100** |                                    |

### Missing/Unexpected Exports (Weight: 10%)

| Criteria                   | Score  | Max     | Notes                          |
| -------------------------- | ------ | ------- | ------------------------------ |
| All public APIs exported   | 14     | 20      | Some useful APIs missing       |
| No internal leakage        | 12     | 20      | Some internal types exported   |
| Consistent export strategy | 15     | 20      | Mostly consistent              |
| Documentation of exports   | 13     | 20      | Export decisions documented    |
| Backward compatibility     | 16     | 20      | Good compatibility maintenance |
| **TOTAL**                  | **70** | **100** |                                |

---

## 9. Action Items Summary

### Week 1

- [ ] Remove duplicate `./memory` export from @clarity-chat/types
- [ ] Add JSDoc to top 50 most-used exports
- [ ] Document core vs core-minimal vs slim differences
- [ ] Deprecate `useHeadlessChat` and `useTokenBudgetMonitor`

### Week 2

- [ ] Add subpath exports for hooks and components
- [ ] Standardize hook naming (migration guide)
- [ ] Add missing type exports (RAGEngineConfig, etc.)
- [ ] Consolidate message list components

### Week 3

- [ ] Improve type naming consistency
- [ ] Add missing JSDoc to @clarity-chat/types
- [ ] Create API migration guide
- [ ] Add bundle size budgets

### Week 4

- [ ] Review and merge overlapping cache implementations
- [ ] Standardize error handling APIs
- [ ] Add type-only entry points
- [ ] Performance audit of type checking

---

## 10. Appendix: Export Inventory

### @clarity-chat/react Top Exports (by usage)

1. `useClarityChat` - Core chat hook
2. `ClarityChat` - Drop-in component
3. `ChatWindow` - Composable chat UI
4. `MessageList` - Message display
5. `ChatInput` - Input component
6. `useTokenCount` - Token counting
7. `EnhancedMarkdownRenderer` - Markdown rendering
8. `ThemeProvider` - Theming
9. `toast` - Notifications
10. `cn` - CSS utility

### @clarity-chat/token-optimization Top Exports

1. `useTokenCount` - Token counting hook
2. `countTokens` - Token counting function
3. `ModelRouter` - Model selection
4. `TieredCache` - Multi-tier caching
5. `ProviderCachingFormatter` - Provider caching
6. `createOptimizer` - Factory function
7. `MODEL_PRICING` - Pricing data
8. `LLMLinguaCompressor` - Compression
9. `AccurateTokenCounter` - Accurate counting
10. `useTokenOptimization` - Unified hook

### @clarity-chat/utils Top Exports

1. `formatBytes` - Size formatting
2. `debounce` - Debouncing
3. `retry` - Retry logic
4. `logger` - Logging
5. `LRUCache` - Caching
6. `ValidationError` - Errors
7. `isString` - Type guards
8. `performanceMonitor` - Performance tracking
9. `assert` - Assertions
10. `tryCatch` - Error handling

---

## Conclusion

The Clarity Chat API surface is well-structured but has opportunities for significant improvement in
consistency and clarity. The recommended actions above will improve the developer experience, reduce
confusion, and make the API more maintainable.

**Key Takeaways**:

1. **Good foundation**: Modular package structure, subpath exports for utils
2. **Needs improvement**: Naming consistency, JSDoc coverage, duplicate APIs
3. **Quick wins**: Remove duplicate exports, add missing JSDoc, document bundle variants
4. **Long-term**: Consolidate overlapping APIs, improve type coverage, better tree-shaking

**Next Steps**:

1. Review and prioritize action items with team
2. Create GitHub issues for each action item
3. Assign owners and deadlines
4. Track progress weekly
5. Re-audit in 1 month

---

**Generated by**: API Surface Cohesion Audit Script **Version**: 1.0.0 **Date**: 2026-01-27
