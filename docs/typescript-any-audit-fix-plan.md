# TypeScript `any` Audit and Fix Plan

## Executive Summary

- **Total `any` usages**: 708 instances across 175 files
- **Production code**: 488 instances across 127 files
- **Test code**: 220 instances across 48 files
- **Declaration files**: 12 instances in prismjs.d.ts

---

## Category Analysis

### Category 1: Third-Party Browser APIs (63 instances)
**Pattern**: `(window as any).gtag`, `(window as any).mixpanel`, `(navigator as any).userAgentData`

**Root Cause**: Browser APIs and third-party SDKs loaded via script tags lack type definitions.

**Files Affected**:
- `analytics/providers.ts` (46 instances) - gtag, mixpanel, posthog, amplitude
- `error/providers.ts` (15 instances) - Sentry, Rollbar, Bugsnag
- `hooks/input/use-voice-input.tsx` (6 instances) - SpeechRecognition API
- `hooks/keyboard/use-keyboard-shortcuts.tsx` (1 instance) - userAgentData
- `hooks/keyboard/use-keyboard-navigation.tsx` (1 instance) - userAgentData

**Fix Strategy**: Create declaration files for browser APIs
```typescript
// types/browser-apis.d.ts
interface Window {
  gtag?: Gtag.Gtag;
  mixpanel?: MixpanelInstance;
  posthog?: PostHogInstance;
  amplitude?: AmplitudeInstance;
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface Navigator {
  userAgentData?: NavigatorUAData;
}
```

**Effort**: Medium (2-3 days)

---

### Category 2: Type Assertions for Casting (143 instances)
**Pattern**: `value as any`, `obj as any`, `response as any`

**Subcategories**:
- **API responses** (18 instances): Need proper response interfaces
- **React component props** (5 instances): Need proper generic constraints
- **Test mocks** (40+ in test files): Often acceptable in tests
- **Workarounds for library types** (80+ instances): Need investigation

**Files Affected**:
- `utils/optimization/token-optimization.ts` (12 instances)
- `utils/tokenization/intelligent-caching.ts` (11 instances)
- `components/ai/enhanced-markdown-renderer.tsx` (12 instances)
- `memory/memory-provider.tsx` (5 instances)

**Fix Strategy**: Create proper interfaces and use generics
```typescript
// Before
const data = response.json() as any

// After
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
const data = await response.json() as ApiResponse<UserData>
```

**Effort**: High (5-7 days)

---

### Category 3: Generic Data Structures (40 instances)
**Pattern**: `data: any`, `obj: any`, `value: any`

**Files Affected**:
- `utils/toon/encoder.ts` (11 instances) - JSON encoding utilities
- `utils/toon/decoder.ts` (8 instances) - JSON decoding utilities
- `utils/toon/optimizer.ts` (4 instances) - Data optimization

**Fix Strategy**: Use `unknown` + type guards or generics
```typescript
// Before
function processData(data: any): string { ... }

// After
function processData<T>(data: T): string { ... }
// Or with type guards
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null) { ... }
}
```

**Effort**: Medium (3-4 days)

---

### Category 4: Array Types (51 instances)
**Pattern**: `items: any[]`, `results: any[]`, `metrics: any[]`

**Files Affected**:
- `utils/optimization/performance-optimization.ts` (12 instances)
- `enterprise/enterprise-feature-base.ts` (6 instances)
- `vector-stores/qdrant.ts` (5 instances)
- `vector-stores/weaviate.ts` (4 instances)

**Fix Strategy**: Define proper array item types
```typescript
// Before
private metrics: any[] = []

// After
interface MetricEntry {
  name: string;
  value: number;
  timestamp: Date;
}
private metrics: MetricEntry[] = []
```

**Effort**: Medium (2-3 days)

---

### Category 5: Event Handlers (56 instances)
**Pattern**: `event: any`, `(event: any) => void`

**Files Affected**:
- `hooks/input/use-voice-input.tsx` (4 instances) - Speech events
- `hooks/streaming/use-streamable-ui.ts` (7 instances) - Stream events
- `hooks/streaming/use-streaming-websocket.tsx` (4 instances) - WebSocket events
- `accessibility/accessibility-automation.ts` (5 instances) - Keyboard events

**Fix Strategy**: Use proper DOM/API event types
```typescript
// Before
recognition.onresult = (event: any) => { ... }

// After
recognition.onresult = (event: SpeechRecognitionEvent) => { ... }
```

**Effort**: Low (1-2 days)

---

### Category 6: Function Arguments (16 instances)
**Pattern**: `(...args: any[])`, `handler: (...args: any[]) => void`

**Files Affected**:
- `utils/optimization/performance.ts` (7 instances) - throttle/debounce
- `hooks/performance/enhanced.ts` (6 instances) - memoization
- `hooks/dashboard/use-dashboard-composer.ts` (1 instance)
- `hooks/dashboard/use-dashboard-data.ts` (1 instance)

**Fix Strategy**: Use generics with proper constraints
```typescript
// Before
function throttle<T extends (...args: any[]) => any>(fn: T): T

// After
function throttle<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn
```

**Effort**: Medium (2 days)

---

### Category 7: Return Types (30 instances)
**Pattern**: `): any {`, `): any[]`

**Files Affected**:
- `utils/tokenization/smart-truncation.ts` (10 instances)
- `utils/tokenization/response-optimization.ts` (9 instances)
- `utils/tokenization/adaptive-optimizer.ts` (9 instances)

**Fix Strategy**: Define explicit return types
```typescript
// Before
function parseValue(value: string): any { ... }

// After
type ParsedValue = string | number | boolean | null | Record<string, unknown>;
function parseValue(value: string): ParsedValue { ... }
```

**Effort**: Medium (2-3 days)

---

### Category 8: Declaration Files (12 instances)
**Pattern**: Prism.js language imports

**File**: `prismjs.d.ts`

**Fix Strategy**: Install proper types or enhance declarations
```typescript
// Option 1: Install @types/prismjs
npm install -D @types/prismjs

// Option 2: Proper module declarations
declare module 'prismjs/components/prism-typescript' {
  import { Grammar } from 'prismjs';
  const grammar: Grammar;
  export default grammar;
}
```

**Effort**: Low (0.5 days)

---

### Category 9: Record/Map Types (163 instances)
**Pattern**: `Record<string, any>`, `Map<string, any>`

**Files Affected**:
- Spread across many files for metadata, options, and config objects

**Fix Strategy**: Define specific interfaces or use index signatures with known types
```typescript
// Before
metadata: Record<string, any>

// After
interface VectorMetadata {
  source?: string;
  timestamp?: number;
  [key: string]: string | number | boolean | undefined;
}
metadata: VectorMetadata
```

**Effort**: High (5-7 days)

---

## Top 20 Files to Fix (Prioritized by Impact)

| Priority | File | Count | Category | Impact | Effort |
|----------|------|-------|----------|--------|--------|
| 1 | `analytics/providers.ts` | 46 | Third-party APIs | High | Medium |
| 2 | `error/providers.ts` | 15 | Third-party APIs | High | Low |
| 3 | `utils/optimization/token-optimization.ts` | 12 | Generic data | High | Medium |
| 4 | `utils/optimization/performance-optimization.ts` | 12 | Arrays/Functions | High | Medium |
| 5 | `components/ai/enhanced-markdown-renderer.tsx` | 12 | Plugin types | Medium | Low |
| 6 | `utils/toon/encoder.ts` | 11 | Generic data | Medium | Medium |
| 7 | `utils/tokenization/intelligent-caching.ts` | 11 | Cache types | High | Medium |
| 8 | `utils/tokenization/smart-truncation.ts` | 10 | Return types | Medium | Medium |
| 9 | `utils/tokenization/response-optimization.ts` | 9 | Return types | Medium | Medium |
| 10 | `utils/tokenization/adaptive-optimizer.ts` | 9 | Return types | Medium | Medium |
| 11 | `utils/toon/decoder.ts` | 8 | Generic data | Medium | Medium |
| 12 | `hooks/token/use-token-optimization-enhanced.tsx` | 8 | Cache types | Medium | Low |
| 13 | `components/message/message-optimized.tsx` | 8 | Props types | Medium | Low |
| 14 | `utils/optimization/performance.ts` | 7 | Function types | High | Low |
| 15 | `types/tool-result-types.ts` | 7 | Type guards | High | Low |
| 16 | `hooks/streaming/use-streamable-ui.ts` | 7 | Stream types | Medium | Low |
| 17 | `hooks/input/use-voice-input.tsx` | 6 | Browser APIs | Medium | Low |
| 18 | `hooks/performance/enhanced.ts` | 6 | Function types | High | Low |
| 19 | `enterprise/enterprise-feature-base.ts` | 6 | Metrics types | Medium | Medium |
| 20 | `vector-stores/qdrant.ts` | 5 | API responses | High | Medium |

---

## Proposed Type Definitions

### 1. Browser API Types (`types/browser-apis.d.ts`)
```typescript
// Google Analytics
interface Gtag {
  (command: 'js', date: Date): void;
  (command: 'config', targetId: string, config?: GtagConfig): void;
  (command: 'event', eventName: string, eventParams?: GtagEventParams): void;
}

interface GtagConfig {
  page_path?: string;
  page_title?: string;
  user_id?: string;
  user_properties?: Record<string, unknown>;
}

interface GtagEventParams {
  [key: string]: unknown;
  user_id?: string;
}

// Mixpanel
interface MixpanelInstance {
  init(token: string, config?: MixpanelConfig): void;
  track(eventName: string, properties?: Record<string, unknown>): void;
  identify(distinctId: string): void;
  people: {
    set(properties: Record<string, unknown>): void;
  };
  reset(): void;
}

// PostHog
interface PostHogInstance {
  init(apiKey: string, options: PostHogOptions): void;
  capture(eventName: string, properties?: Record<string, unknown>): void;
  identify(distinctId: string, properties?: Record<string, unknown>): void;
  reset(): void;
}

// Speech Recognition
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

// Navigator extensions
interface NavigatorUAData {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
}
```

### 2. API Response Types (`types/api-responses.d.ts`)
```typescript
// Vector store responses
interface QdrantSearchResponse {
  result: QdrantSearchResult[];
  status: string;
  time: number;
}

interface QdrantSearchResult {
  id: string | number;
  score: number;
  payload?: Record<string, unknown>;
  vector?: number[];
}

interface PineconeQueryResponse {
  matches: PineconeMatch[];
  namespace: string;
}

interface PineconeMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, unknown>;
}

// Embedding responses
interface EmbeddingResponse {
  data: { embedding: number[]; index: number }[];
  model: string;
  usage: { prompt_tokens: number; total_tokens: number };
}
```

### 3. Metrics and Event Types (`types/metrics.d.ts`)
```typescript
interface MetricEntry {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

interface PerformanceMetric {
  operation: string;
  duration: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}

interface EnterpriseEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
  correlationId?: string;
}
```

### 4. Cache and Storage Types (`types/cache.d.ts`)
```typescript
interface CacheEntry<T = unknown> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface TokenCacheEntry {
  query: string;
  response: string;
  tokens: number;
  timestamp: number;
}

interface SimilarityCacheEntry<T = unknown> {
  embedding: number[];
  data: T;
  similarity: number;
}
```

---

## Implementation Roadmap

### Phase 1: Quick Wins (1 week)
- Create browser API declaration files
- Fix declaration file (`prismjs.d.ts`)
- Add event types for speech recognition and WebSocket
- Total: ~75 `any` removals

### Phase 2: Third-Party Integrations (1 week)
- Type analytics providers (gtag, mixpanel, posthog, amplitude)
- Type error providers (Sentry, Rollbar, Bugsnag)
- Total: ~60 `any` removals

### Phase 3: Core Utilities (2 weeks)
- Type token optimization utilities
- Type TOON encoder/decoder
- Type performance utilities
- Total: ~80 `any` removals

### Phase 4: Data Structures (2 weeks)
- Define proper interfaces for Record<string, any> usages
- Type metrics and event systems
- Type cache entries
- Total: ~150 `any` removals

### Phase 5: Components and Hooks (1 week)
- Type streaming hooks
- Type voice input
- Type component props
- Total: ~50 `any` removals

### Phase 6: Test Files (1 week)
- Selectively type test mocks where beneficial
- Some `any` in tests is acceptable for mocking
- Total: ~70 `any` removals (targeting high-value tests)

---

## Estimated Effort by Category

| Category | Count | Effort | Priority |
|----------|-------|--------|----------|
| Third-party Browser APIs | 63 | Medium | High |
| Type Assertions | 143 | High | Medium |
| Generic Data Structures | 40 | Medium | Medium |
| Array Types | 51 | Medium | Medium |
| Event Handlers | 56 | Low | High |
| Function Arguments | 16 | Medium | Low |
| Return Types | 30 | Medium | Medium |
| Declaration Files | 12 | Low | High |
| Record/Map Types | 163 | High | Low |
| **Test Files** | 220 | Low | Low |

---

## Success Metrics

1. **Reduction Target**: 80% reduction in production code `any` usage (488 -> ~100)
2. **Type Coverage**: Increase type coverage from ~85% to >95%
3. **Build Time**: No significant increase in TypeScript compilation time
4. **Developer Experience**: Clear error messages for type mismatches

---

## Recommendations

1. **Start with declaration files** - Biggest impact for least effort
2. **Use `unknown` over `any`** - Forces proper type narrowing
3. **Enable stricter TypeScript options** gradually:
   - `noImplicitAny: true` (already enabled)
   - `strictNullChecks: true`
   - `strictFunctionTypes: true`
4. **Consider @typescript-eslint rules**:
   - `@typescript-eslint/no-explicit-any`
   - `@typescript-eslint/no-unsafe-assignment`
   - `@typescript-eslint/no-unsafe-member-access`

---

## Notes on Acceptable `any` Usage

Some `any` usage may be intentional and acceptable:
- **Test mocks**: Complex mock objects may use `any` for simplicity
- **Plugin systems**: Extensible plugin APIs may need `any`
- **Interop with untyped libraries**: When types truly don't exist
- **Performance-critical paths**: Where type inference overhead matters

Document these cases with `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comments explaining why.
