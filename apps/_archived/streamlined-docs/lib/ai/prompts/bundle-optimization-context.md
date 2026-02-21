# Clarity Chat Bundle Optimization Context

This document provides context for AI reasoning about bundle sizes, entry points, and optimization strategies for Clarity Chat Components.

## Entry Points

### @clarity-chat/react (Full Bundle)
- **Size**: ~120KB gzipped
- **When to use**: When you need enterprise features, advanced analytics, or comprehensive functionality
- **Includes**: All features below

### @clarity-chat/react/core (Core Bundle)
- **Size**: ~60KB gzipped
- **When to use**: Standard chat applications with theming and memory management
- **Includes**:
  - All core-minimal features
  - Theming system (~12KB)
  - Memory management (~8KB)

### @clarity-chat/react/core-minimal (Minimal Bundle)
- **Size**: ~30KB gzipped
- **When to use**: Lightweight chat implementations, mobile-first apps
- **Includes**:
  - Chat primitives (~15KB)
  - Message rendering (~10KB)
  - Input handling (~8KB)
  - Streaming support (~5KB)

## Feature Size Estimates

### Core Features (Always Included in core-minimal)
- **Chat primitives**: ~15KB (message display, conversation management)
- **Message rendering**: ~10KB (markdown, code blocks, basic formatting)
- **Input handling**: ~8KB (text input, submission, validation)
- **Streaming support**: ~5KB (SSE, real-time updates)

### Standard Features (Included in core)
- **Theming system**: ~12KB (light/dark mode, custom themes, CSS variables)
- **Memory management**: ~8KB (conversation history, context management)

### Advanced Features (Full bundle or lazy-loadable)
- **RAG integration**: ~15KB (vector search, document retrieval) - **LAZY LOADABLE**
- **Agent system**: ~12KB (tool calling, multi-step reasoning) - **LAZY LOADABLE**
- **Analytics**: ~10KB (usage tracking, performance metrics) - **LAZY LOADABLE**
- **Token optimization**: ~8KB (budget monitoring, smart truncation) - **LAZY LOADABLE**
- **Vector stores**: ~10KB (embeddings, semantic search) - **LAZY LOADABLE**
- **Enterprise features**: ~20KB (SSO, audit logs, compliance) - **LAZY LOADABLE**
- **Animations**: ~15KB (Framer Motion, transitions) - **NOT lazy loadable**
- **Voice input**: ~12KB (speech-to-text, audio processing) - **LAZY LOADABLE**
- **File upload**: ~10KB (multipart forms, preview, validation) - **LAZY LOADABLE**

## Lazy Loading Pattern

Features marked as "LAZY LOADABLE" can be loaded on-demand to reduce initial bundle size:

```tsx
import { lazyLoadRAG } from '@clarity-chat/react/lazy'
import { lazyLoadAnalytics } from '@clarity-chat/react/lazy'

// Load on demand
const rag = await lazyLoadRAG()
const analytics = await lazyLoadAnalytics()
```

**Strategy**: Start with `core-minimal` + lazy load advanced features = ~30KB initial + features loaded as needed

## Decision Tree for Entry Point Selection

### Use @clarity-chat/react/core-minimal when:
- Building mobile-first applications
- Bundle size is critical (<50KB target)
- Only need basic chat functionality
- Don't need theming or memory management
- Advanced features can be lazy loaded

### Use @clarity-chat/react/core when:
- Need theming support (light/dark mode, custom themes)
- Need memory management (conversation history, context retention)
- Building standard web applications
- Bundle size <100KB acceptable
- Advanced features can be lazy loaded

### Use @clarity-chat/react (full) when:
- Need non-lazy-loadable advanced features (animations)
- Building enterprise applications
- Bundle size not a primary concern
- Need immediate access to all features
- Simpler import patterns preferred over lazy loading

## Optimization Strategies

### 1. Progressive Enhancement
Start minimal, add features as needed:
```
core-minimal (30KB) → + theming (12KB) → + RAG (lazy) → + analytics (lazy)
```

### 2. Route-Based Code Splitting
Load heavy features only on specific routes:
```
/chat → core-minimal
/analytics → + analytics (lazy)
/admin → + enterprise (lazy)
```

### 3. Conditional Loading
Load features based on user tier or device:
```tsx
if (isPremiumUser) {
  await lazyLoadAnalytics()
}

if (!isMobile) {
  await lazyLoadVoiceInput()
}
```

### 4. Tree Shaking
Import only what you use:
```tsx
// ✅ Good: Tree-shakeable
import { ChatWindow, MessageList } from '@clarity-chat/react'

// ❌ Bad: Imports everything
import * as ClarityChat from '@clarity-chat/react'
```

## Bundle Impact Calculation Guidelines

When a user asks about bundle impact:

1. **Identify Required Features**: Parse user's needs into feature list
2. **Categorize by Entry Point**:
   - Core-minimal features → start with core-minimal
   - Core features (theming/memory) → use core
   - Non-lazy advanced features (animations) → use full
3. **Calculate Total Size**: Sum base + non-lazy features
4. **Identify Lazy-Loadable**: List features that can be loaded on-demand
5. **Recommend Strategy**: Suggest optimal entry point + lazy loading
6. **Provide Optimization Tips**: Specific advice based on feature set

## Example Reasoning

**User Query**: "I need streaming chat with dark mode, analytics, and RAG"

**Analysis**:
- Streaming: ✓ Included in core-minimal (5KB)
- Dark mode: Requires theming (~12KB) → Need `core` bundle
- Analytics: Advanced feature (~10KB) → Lazy loadable
- RAG: Advanced feature (~15KB) → Lazy loadable

**Recommendation**:
- Entry point: `@clarity-chat/react/core` (60KB)
- Initial load: 60KB (includes streaming + dark mode)
- Lazy load: Analytics (10KB) + RAG (15KB) = 25KB on-demand
- Total if all loaded: 85KB
- Initial bundle: 60KB (30% smaller than full 120KB)

**Optimization Tips**:
1. Use `lazyLoadAnalytics()` only when user visits analytics page
2. Use `lazyLoadRAG()` only when user enables document search
3. Consider `core-minimal` (30KB) + lazy theming if dark mode is optional

## Common Patterns

### Pattern 1: Mobile-First Progressive Enhancement
```
core-minimal (30KB) → detect desktop → lazy load voice (12KB)
Result: 30KB mobile, 42KB desktop
```

### Pattern 2: Tiered Feature Loading
```
Free tier: core-minimal (30KB)
Pro tier: + analytics (lazy 10KB)
Enterprise: + enterprise features (lazy 20KB)
```

### Pattern 3: Route-Based Splitting
```
/chat: core-minimal (30KB)
/settings: + theming (lazy 12KB from core)
/admin: + enterprise (lazy 20KB)
```

## Performance Considerations

- **Initial Load Priority**: Aim for <50KB for mobile, <100KB for desktop
- **Lazy Load Timing**: Load on user interaction or route navigation
- **Network-Aware**: Check connection quality before lazy loading heavy features
- **Cache Strategy**: Lazy-loaded chunks cached by service worker
- **Code Splitting**: Next.js automatically splits route-based imports

## Version Compatibility

- All entry points support the same API surface
- Lazy loading available in v1.0+
- Tree shaking requires ESM build tools
- Full TypeScript support across all entry points

---

**Last Updated**: January 26, 2026
**Version**: 1.0+
