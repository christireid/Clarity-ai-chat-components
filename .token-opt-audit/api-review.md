# Token Optimization Package — API Design Review

**Date**: 2026-01-22
**Phase**: Phase 3 - API & DX Deep Review
**Focus**: Public API Design, Standalone Usage, Extensibility
**Status**: ✅ COMPLETE

---

## EXECUTIVE SUMMARY

**Standalone Usage**: ❌ PARTIALLY BLOCKED - Hard dependency on `@clarity-chat/primitives` for React components
**Configuration**: ⚠️ CONFLICTING - Duplicate defaults with different values
**Default Safety**: ⚠️ MEDIUM RISK - Expensive default model, inconsistent security defaults
**Extensibility**: ❌ POOR - No APIs to add custom models, providers, or compression strategies
**Type Self-Documentation**: ✅ GOOD - Well-documented with JSDoc, some naming conflicts
**API Consistency**: ⚠️ INCONSISTENT - Mixed patterns for caching, naming

**Overall API Grade**: C+ (Functional but needs significant improvements for enterprise use)

---

## 1. CAN THIS BE USED WITHOUT CLARITY CHAT?

### CRITICAL FINDING: Hard Dependency on @clarity-chat/primitives

**Status**: ❌ BLOCKED for React components, ✅ WORKS for core features

**Issue**:
The package has a hard dependency on `@clarity-chat/primitives` which brings in the entire Clarity UI ecosystem (Radix UI, framer-motion, tailwindcss).

**Evidence**:
- `package.json` line 52: `"@clarity-chat/primitives": "workspace:*"`
- All React components import from primitives:
  - `src/react/components/TokenCostPreview.tsx`
  - `src/react/components/TokenUsageMeter.tsx`
  - `src/react/components/TokenOptimizationPanel.tsx`
  - `src/react/components/TokenOptimizationDashboard.tsx`
  - `src/react/components/TokenOptimizationBadge.tsx`

**User Impact**:
- Enterprise users **CANNOT use React components without installing entire Clarity ecosystem**
- Bundle bloat: primitives adds ~60KB + Radix UI dependencies (~200KB)
- Forced dependency on Clarity-specific styling (glassmorphism, tailwind)

**What Works Standalone**:
```typescript
// ✅ Works without Clarity dependencies
import { countTokens, createOptimizer } from '@clarity-chat/token-optimization'
import { useTokenCount } from '@clarity-chat/token-optimization/react' // hooks work
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization/compression'
```

**What Requires Clarity**:
```typescript
// ❌ Requires @clarity-chat/primitives
import { TokenCostPreview, TokenUsageMeter } from '@clarity-chat/token-optimization/react'
```

**Recommendation**:
**Option 1 (Best)**: Split package into two
- `@clarity-chat/token-optimization` (core, standalone)
- `@clarity-chat/token-optimization-react` (React components with primitives)

**Option 2**: Make primitives truly optional
- Export headless/unstyled component versions
- Use conditional imports: `try { import primitives } catch { fallback }`

**Severity**: HIGH (blocks enterprise standalone adoption)

---

## 2. IS CONFIGURATION EXPLICIT?

### CRITICAL FINDING: Duplicate and Conflicting Defaults

**Status**: ❌ DANGEROUS - Two files with different defaults for same settings

**Issue**:
Two separate default configuration files with **CONFLICTING values** for critical settings.

**Evidence**:

**File 1**: `/src/defaults.ts` (lines 205-214)
```typescript
export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enablePIIRedaction: false,  // ← FALSE
  enableAuditLogging: false,  // ← FALSE
  complianceLevel: 'basic' as const,
}
```

**File 2**: `/src/constants.ts` (lines 15-23)
```typescript
export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enableCompressionObfuscation: true,
  enableAuditLogging: true,  // ← TRUE (CONFLICT!)
  enablePIIRedaction: true,   // ← TRUE (CONFLICT!)
  noiseLevel: 0.1,
  complianceLevel: 'enterprise' as const,  // ← CONFLICT!
  auditRetention: 30,
}
```

**Additional Conflicts**:
| Setting | defaults.ts | constants.ts | Impact |
|---------|-------------|--------------|--------|
| DEFAULT_MODEL | 'gpt-4o' | 'gpt-4' | Token counting accuracy |
| DEFAULT_MAX_CACHE_SIZE | 1000 | 100000 | Memory usage |
| Security level | 'basic' | 'enterprise' | Security posture |
| PII redaction | false | true | Compliance risk |
| Audit logging | false | true | Compliance risk |

**User Impact**:
- **DANGEROUS**: Different security defaults depending on which file is imported
- **UNPREDICTABLE**: Different parts of codebase may use different defaults
- **COMPLIANCE RISK**: No clear indication which is the "real" security level

**Recommendation**:
1. **Consolidate to single source**: Merge into `defaults.ts` only
2. **Deprecate constants.ts**: Add loud deprecation warning
3. **If conflicts intentional**: Document why (e.g., backwards compatibility) and which takes precedence
4. **Add runtime validation**: Warn if both are imported

**Severity**: CRITICAL (security and compliance implications)

---

## 3. ARE DEFAULTS SAFE?

### FINDING: Expensive Default Model with No Cost Warning

**Status**: ⚠️ COST RISK

**Issue**:
Default model is `'gpt-4o'` ($2.50/1M input tokens) with no cost warning in documentation.

**Evidence**:
- `/src/defaults.ts` line 25: `export const DEFAULT_MODEL = 'gpt-4o' as const`
- README "zero-config" examples don't mention cost
- No indication that `'gpt-4o-mini'` is 16x cheaper ($0.15 vs $2.50 per 1M tokens)

**User Impact**:
- New users may rack up unexpected API costs
- "Zero-config" = "Potentially expensive config"

**Recommendation**:
**Option 1 (Best)**: Change default to `'gpt-4o-mini'` (cheaper, still excellent)
**Option 2**: Add prominent cost warning in README:
```markdown
⚠️ **Cost Notice**: Default model is GPT-4o ($2.50/1M tokens). For cost-conscious
applications, use gpt-4o-mini ($0.15/1M tokens):
`useTokenCount(text, { model: 'gpt-4o-mini' })`
```

**Severity**: MEDIUM (cost impact but not security)

---

### FINDING: Security Defaults Are Inconsistent

**Status**: ⚠️ SECURITY RISK

**Issue**: Security defaults vary between "minimal" (`defaults.ts`) and "enterprise-grade" (`constants.ts`).

**User Impact**:
- Users expecting enterprise security (PII redaction, audit logging) based on `constants.ts` may get minimal security from `defaults.ts`
- **Compliance risk**: "Zero-config" does NOT enable PII redaction or audit logging by default

**Recommendation**:
1. **Default to safer settings**: Enable PII redaction by default (users can opt-out)
2. **Add security level presets**:
   ```typescript
   createOptimizer({ securityLevel: 'minimal' | 'standard' | 'enterprise' })
   ```
3. **Document security implications** clearly in README

**Severity**: HIGH (compliance and security risk)

---

## 4. IS EXTENSION OBVIOUS?

### CRITICAL FINDING: No Way to Add Custom Models

**Status**: ❌ NOT EXTENSIBLE

**Issue**:
`MODEL_REGISTRY` is a plain const object with **no documented extension mechanism**.

**Evidence**:
- `/src/models/model-registry.ts` line 135:
  ```typescript
  export const MODEL_REGISTRY: Record<ModelId, TokenModelConfig> = {
    // ... hardcoded 40+ models
  }
  ```
- `ModelId` is a closed union type (lines 18-60)
- No `registerModel()` or similar function
- README mentions extensibility but provides no instructions

**User Impact**:
- **CANNOT use with custom/private models** (e.g., fine-tuned models, private deployments)
- **CANNOT add new providers** (e.g., Cohere, Replicate, local models)
- **Breaking changes required** to add models

**Recommendation**:
```typescript
// Add extension API
export function registerModel(
  id: string,
  config: TokenModelConfig
): void {
  (MODEL_REGISTRY as Record<string, TokenModelConfig>)[id] = config
}

export function createCustomModel(
  id: string,
  config: Partial<TokenModelConfig>
): void {
  // Validate and register with sensible defaults
  const fullConfig = {
    ...DEFAULT_MODEL_CONFIG,
    ...config,
    id
  }
  registerModel(id, fullConfig)
}

// Usage
registerModel('my-custom-gpt', {
  provider: 'openai',
  contextWindow: 128000,
  inputCostPer1M: 1.50,
  // ... rest
})
```

**Severity**: CRITICAL (blocks enterprise customization)

---

### FINDING: Cannot Add Custom Compression Strategies

**Status**: ⚠️ LIMITED EXTENSIBILITY

**Issue**:
`createOptimizer()` factory only supports built-in compression strategies.

**Evidence**:
- `/src/factory.ts` line 339-343: Hardcoded `MarkdownCompressor`
- No way to pass custom compressor
- `OptimizerConfig` doesn't support custom strategies

**User Impact**:
- Cannot implement domain-specific compression (e.g., abbreviations, industry jargon)
- Cannot integrate with external compression services
- Must bypass factory and manually create instances

**Recommendation**:
```typescript
export interface OptimizerConfig {
  // ... existing fields

  /** Custom compressor instance (overrides built-in) */
  customCompressor?: {
    compress: (text: string, options?: any) => {
      compressed: string
      compressionRatio: number
      tokensOriginal: number
      tokensCompressed: number
    }
  }
}
```

**Severity**: MEDIUM (limits advanced use cases)

---

### FINDING: No Provider Extension API

**Status**: ❌ NOT EXTENSIBLE

**Issue**:
Provider-native counting only supports 3 providers (Anthropic, OpenAI, Google) with no extension mechanism.

**Evidence**:
- `/src/tokenizers/provider-native-counter.ts` line 22:
  ```typescript
  provider: 'anthropic' | 'google' | 'openai'  // Closed union
  ```
- No interface or extension point

**User Impact**:
- Cannot add Cohere, Replicate, DeepSeek (already in model registry!), local models
- Cannot integrate with enterprise proxy services
- Breaking change required for new providers

**Recommendation**:
```typescript
export interface ProviderAdapter {
  name: string
  countTokens(text: string, model: string): Promise<number>
  supportsModel(model: string): boolean
}

export class ProviderNativeCounter {
  private static providers = new Map<string, ProviderAdapter>()

  static registerProvider(adapter: ProviderAdapter): void {
    this.providers.set(adapter.name, adapter)
  }

  constructor(config: {
    provider: string  // Now accepts any registered provider
    adapter?: ProviderAdapter  // Inline custom adapter
    // ...
  })
}
```

**Severity**: HIGH (prevents custom provider integration)

---

## 5. ARE TYPES SELF-DOCUMENTING?

### FINDING: Type Name Collisions

**Status**: ⚠️ CONFUSING

**Issue**:
Multiple types with overlapping names cause confusion.

**Evidence**:
- `ModelConfig` in `/src/routing/model-router.ts` (line 61)
- `TokenModelConfig` in `/src/models/model-registry.ts` (line 89)
- Comment: "Note: Named TokenModelConfig to avoid collision" (line 87)
- **Both represent model configuration but different shapes**

**User Impact**:
- Confusing imports: `import { ModelConfig }` - which one?
- Type errors with cryptic messages
- Poor IntelliSense experience

**Recommendation**:
**Option 1**: Rename for clarity
- `TokenModelConfig` → `ModelRegistryEntry`
- `ModelConfig` (routing) → `RoutingModelConfig`

**Option 2**: Namespace
```typescript
export namespace Registry {
  export interface ModelConfig { /* ... */ }
}
export namespace Routing {
  export interface ModelConfig { /* ... */ }
}
```

**Severity**: MEDIUM (DX impact)

---

### FINDING: Verbose Hook Type Names

**Status**: ⚠️ NOT IDIOMATIC

**Issue**:
Hook type names are extremely verbose (30+ characters).

**Evidence**:
- `UseTokenOptimizationConfig` (30 chars)
- `UseTokenOptimizationReturn` (30 chars)
- `UseOptimizationPipelineReturn` (34 chars)

**Recommendation**:
```typescript
// Current (verbose)
export interface UseTokenOptimizationConfig { /* ... */ }

// Better (idiomatic React)
export interface TokenOptimizationOptions { /* ... */ }
export interface TokenOptimizationResult { /* ... */ }

// Usage
function useTokenOptimization(
  options?: TokenOptimizationOptions
): TokenOptimizationResult
```

**Severity**: LOW (style issue)

---

## 6. API CONSISTENCY

### FINDING: Inconsistent Cache Result Patterns

**Status**: ⚠️ INCONSISTENT

**Issue**:
Different cache functions return different shapes.

**Evidence**:
- `TieredCache.get()` → `{ hit: boolean, data?: string }`
- `getFromCache()` in hooks → `string | undefined`
- `ExactCache.get()` → `{ hit: boolean, data?: T }`

**User Impact**:
- Inconsistent error handling across codebase
- Migration difficulty when switching cache types
- Harder to learn

**Recommendation**:
Standardize on object return (more informative):
```typescript
interface CacheResult<T> {
  hit: boolean
  data?: T
  source?: 'exact' | 'semantic' | 'tiered'
  ttl?: number
}
```

**Severity**: MEDIUM (consistency issue)

---

### FINDING: Mixed "cache" vs "caching" Terminology

**Status**: ⚠️ MINOR INCONSISTENCY

**Evidence**:
- Directory: `/src/cache/` (no "ing")
- Directory: `/src/caching/` (with "ing")
- Config: `enableCaching` vs `enableCache`

**Recommendation**:
- Choose "cache" (noun, industry standard)
- Rename `/src/caching/` → `/src/cache/semantic/`
- Standardize config to `enableCache`

**Severity**: LOW (minor)

---

## 7. EASE OF GETTING STARTED

### FINDING: README Example Uses Wrong Entry Point

**Status**: ⚠️ CONFUSING

**Issue**:
README examples are inconsistent about import paths.

**Evidence**:
```typescript
// Example 1
import { useTokenCount } from '@clarity-chat/token-optimization'

// Example 2 (later in README)
import { useTokenCount } from '@clarity-chat/token-optimization/react'
```

**Recommendation**:
Add clear entry points section in README:
```markdown
## Entry Points

- `@clarity-chat/token-optimization` - Core (Node.js, browser)
- `@clarity-chat/token-optimization/react` - React hooks & components
- `@clarity-chat/token-optimization/compression` - Compression only
- `@clarity-chat/token-optimization/cache` - Caching only
```

**Severity**: MEDIUM (onboarding friction)

---

### FINDING: "Optional" Peer Dependencies That Aren't Actually Optional

**Status**: ⚠️ MISLEADING

**Issue**:
React and framer-motion marked as optional, but components crash without them.

**Evidence**:
```json
"peerDependenciesMeta": {
  "react": { "optional": true },
  "framer-motion": { "optional": true }
}
```

But components use both unconditionally.

**User Impact**:
- `npm install` succeeds, runtime fails
- Confusing errors: "Cannot find module 'react'"

**Recommendation**:
**Option 1**: Split package (see Issue #1)
**Option 2**: Document clearly:
```markdown
## Installation

For Node.js (core features):
```bash
npm install @clarity-chat/token-optimization
```

For React (components & hooks):
```bash
npm install @clarity-chat/token-optimization react react-dom framer-motion
```
```

**Severity**: MEDIUM (confusing installation)

---

## 8. ADVANCED USAGE

### Summary of Extension Gaps

All covered above:
- ❌ No model registration API (Issue #4.1)
- ❌ No provider adapter API (Issue #4.3)
- ⚠️ Limited compression extensibility (Issue #4.2)

---

## POSITIVE FINDINGS

Despite issues, the package has many API strengths:

1. ✅ **Excellent JSDoc coverage** - Most exports well-documented
2. ✅ **Thoughtful error handling** - `HelpfulError` classes with suggestions
3. ✅ **Good separation of concerns** - Core/React/Compression entry points
4. ✅ **Sensible presets** - minimal/standard/production/enterprise
5. ✅ **Comprehensive model registry** - 40+ models from 6 providers
6. ✅ **Strong TypeScript support** - Discriminated unions, type guards

---

## STOP CONDITION: ✅ COMPLETE

Phase 3 API Review requirements met:
- ✅ Evaluated standalone usage (partially blocked by primitives dependency)
- ✅ Assessed configuration (conflicting defaults identified)
- ✅ Checked default safety (cost and security risks found)
- ✅ Reviewed extensibility (no extension APIs found)
- ✅ Validated type documentation (generally good, some collisions)
- ✅ Assessed API consistency (cache patterns inconsistent)
- ✅ Evaluated ease of getting started (README inconsistencies)
- ✅ Reviewed advanced usage (extension gaps documented)

**Next Phase**: Phase 4 — Functional & Real-World Verification
