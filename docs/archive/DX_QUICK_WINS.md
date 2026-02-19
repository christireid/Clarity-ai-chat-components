# DX Quick Wins - Implementation Guide

These are high-impact, low-effort improvements that can be implemented immediately.

---

## Quick Win 1: Add Styles Detection Warning (5 minutes)

### Problem
Users forget to import styles, resulting in unstyled components with no clear error.

### Solution
Add development-mode warning when styles are missing.

### File: `/packages/react/src/app-api/ClarityChatApp.tsx`

Add this `useEffect` after imports:

```tsx
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    // Check if Clarity styles are loaded
    const hasStyles =
      document.querySelector('style[data-clarity-chat]') ||
      document.querySelector('link[href*="clarity-chat"]') ||
      document.querySelector('link[href*="@clarity-chat/react"]')

    if (!hasStyles) {
      console.warn(
        '%c[Clarity Chat] Styles not detected',
        'color: #ff9800; font-weight: bold; font-size: 14px;',
        '\n\n📦 Import styles in your root component:\n\n',
        '  import "@clarity-chat/react/styles.css"\n\n',
        'Or add to your global CSS:\n\n',
        '  @import "@clarity-chat/react/styles.css";\n'
      )
    }
  }
}, [])
```

### Impact
- Users immediately see helpful warning
- Saves hours of debugging confusion
- Only runs once in development mode

---

## Quick Win 2: Improve Preset Type Documentation (10 minutes)

### Problem
Preset names don't convey what features they include or bundle size impact.

### Solution
Add comprehensive JSDoc with bundle sizes.

### File: `/packages/react/src/app-api/types.ts`

Replace the current preset type definition:

```typescript
/**
 * Predefined configuration presets for common use cases
 *
 * Each preset is optimized for a specific scenario and includes
 * sensible defaults. Bundle sizes shown are approximate (minified + gzipped).
 *
 * @preset simple - Minimal setup: Streaming + error recovery + accessible UI
 *   - Features: Streaming, error recovery, accessibility
 *   - Bundle: ~300KB
 *   - Best for: Basic chat, minimal setup, low bandwidth
 *
 * @preset pro - Professional setup: + Token stats + basic safety
 *   - Features: Everything in 'simple' + token optimization stats + content safety
 *   - Bundle: ~350KB (+50KB)
 *   - Best for: Production apps, cost monitoring, content moderation
 *
 * @preset memory - Conversation memory: + Memory with sliding-window
 *   - Features: Everything in 'pro' + conversation memory + context injection
 *   - Bundle: ~380KB (+30KB)
 *   - Best for: Multi-turn conversations, contextual responses
 *
 * @preset rag - Document retrieval: + Sources + chunking + retrieval
 *   - Features: Everything in 'memory' + document processing + vector search
 *   - Bundle: ~500KB (+120KB)
 *   - Best for: Document Q&A, knowledge bases, semantic search
 *   - Note: Requires pdfjs-dist and mammoth peer dependencies
 *
 * @preset tools - Function calling: + Tool registry pattern
 *   - Features: Everything in 'pro' + tool calling + approval system
 *   - Bundle: ~330KB (+30KB)
 *   - Best for: Agents, API integrations, interactive workflows
 *
 * @preset enterprise - Full featured: All features enabled
 *   - Features: Memory + token optimization + RAG + tools + safety + observability
 *   - Bundle: ~600KB (full bundle)
 *   - Best for: Enterprise apps, all features needed, large budgets
 *   - Note: Requires all optional peer dependencies
 *
 * @example
 * ```tsx
 * // Start simple
 * <ClarityChatApp api="/api/chat" preset="simple" />
 *
 * // Add memory for context
 * <ClarityChatApp api="/api/chat" preset="memory" />
 *
 * // Full enterprise features
 * <ClarityChatApp api="/api/chat" preset="enterprise" />
 * ```
 */
export type ClarityAppPreset =
  | 'simple'      // ~300KB - Minimal
  | 'pro'         // ~350KB - + Token stats
  | 'memory'      // ~380KB - + Conversation memory
  | 'rag'         // ~500KB - + Document retrieval
  | 'tools'       // ~330KB - + Function calling
  | 'enterprise'  // ~600KB - Everything
```

### Impact
- Hover tooltips show full feature breakdown
- Bundle size visible at a glance
- Clear use case recommendations
- Examples show progression

---

## Quick Win 3: Add Generic Types to ToolDefinition (15 minutes)

### Problem
`ToolDefinition` uses `unknown` types, making IntelliSense unhelpful.

### Solution
Add generic type parameters with inference.

### File: `/packages/react/src/app-api/types.ts`

Replace the current `ToolDefinition` interface:

```typescript
/**
 * Tool definition for function calling with type-safe parameters and results
 *
 * @template TParams - Type of the validated parameters object
 * @template TResult - Type of the tool execution result
 *
 * @example
 * ```tsx
 * // Define a type-safe tool
 * interface WeatherParams {
 *   location: string
 *   units?: 'celsius' | 'fahrenheit'
 * }
 *
 * interface WeatherResult {
 *   temperature: number
 *   conditions: string
 *   humidity: number
 * }
 *
 * const weatherTool: ToolDefinition<WeatherParams, WeatherResult> = {
 *   name: 'get_weather',
 *   description: 'Get current weather for a location',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       location: { type: 'string', description: 'City name' },
 *       units: { type: 'string', enum: ['celsius', 'fahrenheit'] }
 *     },
 *     required: ['location']
 *   },
 *   execute: async (params) => {
 *     // params is typed as WeatherParams ✅
 *     const weather = await fetchWeather(params.location, params.units)
 *     // Return type must match WeatherResult ✅
 *     return {
 *       temperature: weather.temp,
 *       conditions: weather.desc,
 *       humidity: weather.humidity
 *     }
 *   },
 *   renderer: ({ result }) => {
 *     // result is typed as WeatherResult ✅
 *     return (
 *       <div>
 *         <div>Temperature: {result.temperature}°</div>
 *         <div>Conditions: {result.conditions}</div>
 *       </div>
 *     )
 *   }
 * }
 * ```
 */
export interface ToolDefinition<TParams = any, TResult = any> {
  /** Unique tool identifier (must match AI model function name) */
  name: string

  /** Human-readable description shown to AI and users */
  description: string

  /**
   * JSON Schema or Zod schema for parameter validation
   *
   * @example JSON Schema
   * ```tsx
   * parameters: {
   *   type: 'object',
   *   properties: {
   *     query: { type: 'string', description: 'Search query' }
   *   },
   *   required: ['query']
   * }
   * ```
   *
   * @example Zod Schema
   * ```tsx
   * import { z } from 'zod'
   *
   * parameters: z.object({
   *   query: z.string().min(1).describe('Search query')
   * })
   * ```
   */
  parameters: Record<string, unknown> | { parse: (data: unknown) => TParams }

  /**
   * Execute the tool with validated parameters
   *
   * @param params - Validated parameters matching schema type
   * @param signal - AbortSignal for cancellation support
   * @returns Tool result (will be serialized to JSON for AI)
   *
   * @throws Error if execution fails (will be caught and shown to user)
   */
  execute: (params: TParams, signal?: AbortSignal) => Promise<TResult>

  /**
   * Optional custom UI renderer for tool results
   *
   * If not provided, results are displayed as JSON.
   */
  renderer?: React.ComponentType<{ result: TResult }>

  /**
   * Whether this tool is deterministic (same inputs always produce same outputs)
   *
   * Non-deterministic tools (e.g., get_current_time, random) will not be cached.
   * @default true
   */
  deterministic?: boolean

  /**
   * Risk level of this tool (affects approval requirements)
   *
   * - `safe`: No side effects, read-only (e.g., calculations, get_time)
   * - `low`: Limited side effects, local operations (e.g., read_file)
   * - `medium`: Network access, external APIs (e.g., fetch_url)
   * - `high`: Code execution, system commands (e.g., execute_code)
   *
   * @default 'safe'
   */
  riskLevel?: 'safe' | 'low' | 'medium' | 'high'

  /**
   * Capabilities required by this tool (for access control)
   *
   * @example
   * ```tsx
   * capabilities: ['network:outbound', 'data:sensitive']
   * ```
   */
  capabilities?: Array<
    | 'read:filesystem'
    | 'write:filesystem'
    | 'network:outbound'
    | 'network:inbound'
    | 'code:execute'
    | 'system:command'
    | 'data:sensitive'
    | 'user:impersonate'
  >

  /**
   * Whether this tool requires explicit user approval before execution
   *
   * If not specified, determined by riskLevel and approval configuration.
   */
  requiresApproval?: boolean
}
```

### Impact
- Autocomplete works for `params` in `execute`
- Return type is checked against `TResult`
- `renderer` receives typed `result` prop
- Examples show best practices

---

## Quick Win 4: Add Import Guide Comment (5 minutes)

### Problem
Users don't know when to use `/extended`, `/advanced`, or `/internal`.

### Solution
Add comprehensive import guide at top of index file.

### File: `/packages/react/src/index.ts`

Replace the current header comment with:

```typescript
/**
 * @clarity-chat/react
 *
 * Premium AI Chat Components for React
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📦 IMPORT GUIDE - Where to import from
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ✅ START HERE (90% of users):
 * ```tsx
 * import { ClarityChatApp, useClarityChatApp } from '@clarity-chat/react'
 * import '@clarity-chat/react/styles.css'  // Required!
 * ```
 * Includes: Core components, hooks, streaming, error handling, accessibility
 * Bundle: ~300-400KB depending on features enabled
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🔧 EXTENDED FEATURES (when you need more components):
 * ```tsx
 * import {
 *   TokenOptimizationDashboard,
 *   CommandPaletteEnhanced,
 *   ConversationsList
 * } from '@clarity-chat/react/extended'
 * ```
 * Includes: Additional UI components, dashboards, advanced visualizations
 * Bundle: +50-150KB depending on components imported
 * When to use: Need specialized UI components beyond basic chat
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ⚡ ADVANCED (power users only):
 * ```tsx
 * import {
 *   optimizePrompt,
 *   useClarityObject,
 *   createRAGPipeline
 * } from '@clarity-chat/react/advanced'
 * ```
 * Includes: Low-level utilities, advanced hooks, custom pipelines
 * Bundle: Minimal (utilities only)
 * When to use: Building custom solutions, need fine-grained control
 * ⚠️ Requires understanding of library internals
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🚫 INTERNAL (do not use):
 * ```tsx
 * import { ... } from '@clarity-chat/react/internal'  // ❌ Don't do this
 * ```
 * Internal APIs may change without notice and break your app.
 * Not covered by semantic versioning.
 * Only use if you're contributing to the library.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎨 STYLES (required):
 * ```tsx
 * // Option 1: Import in root component (recommended)
 * import '@clarity-chat/react/styles.css'
 *
 * // Option 2: Add to global CSS
 * @import '@clarity-chat/react/styles.css';
 *
 * // Option 3: Add to Next.js _app.tsx
 * import '@clarity-chat/react/styles.css'
 * ```
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 📚 QUICK START:
 * ```tsx
 * import { ClarityChatApp } from '@clarity-chat/react'
 * import '@clarity-chat/react/styles.css'
 *
 * // Basic setup (3 minutes)
 * export default function ChatPage() {
 *   return <ClarityChatApp api="/api/chat" />
 * }
 *
 * // With features
 * export default function ChatPage() {
 *   return (
 *     <ClarityChatApp
 *       api="/api/chat"
 *       features={{ memory: true, tokenOptimization: true }}
 *     />
 *   )
 * }
 *
 * // With preset
 * export default function ChatPage() {
 *   return <ClarityChatApp api="/api/chat" preset="enterprise" />
 * }
 * ```
 *
 * 🔗 DOCUMENTATION:
 * - Quick Start: https://clarity-chat.dev/docs/quickstart
 * - API Reference: https://clarity-chat.dev/docs/api
 * - Examples: https://clarity-chat.dev/examples
 *
 * @packageDocumentation
 */
```

### Impact
- Users see clear guidance when viewing source
- IDEs show this in hover tooltips
- Reduces confusion about imports
- Links to documentation

---

## Quick Win 5: Add Common Configuration Examples (10 minutes)

### Problem
Users don't know how to combine features or configure common scenarios.

### Solution
Add comprehensive examples to `ClarityChatAppProps` JSDoc.

### File: `/packages/react/src/app-api/types.ts`

Update the `ClarityChatAppProps` interface:

```typescript
/**
 * Props for the ClarityChatApp component
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📖 QUICK EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * @example Minimal setup (just streaming)
 * ```tsx
 * <ClarityChatApp api="/api/chat" />
 * ```
 *
 * @example With memory (conversations persist)
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   features={{ memory: true }}
 * />
 * ```
 *
 * @example Token optimization (reduce costs)
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   features={{ tokenOptimization: true }}
 *   config={{
 *     tokenOptimization: {
 *       budget: 8192,
 *       showStats: true
 *     }
 *   }}
 * />
 * ```
 *
 * @example RAG with documents (Q&A over docs)
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   preset="rag"
 *   sources={[
 *     { type: 'file', file: pdfFile },
 *     { type: 'url', url: 'https://docs.example.com' }
 *   ]}
 * />
 * ```
 *
 * @example Tool calling (function execution)
 * ```tsx
 * const tools = [{
 *   name: 'get_weather',
 *   description: 'Get weather for location',
 *   parameters: { type: 'object', properties: { location: { type: 'string' } } },
 *   execute: async (params) => fetchWeather(params.location)
 * }]
 *
 * <ClarityChatApp
 *   api="/api/chat"
 *   features={{ tools: true }}
 *   config={{ tools: { registry: tools } }}
 * />
 * ```
 *
 * @example Enterprise (all features)
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   preset="enterprise"
 *   systemPrompt="You are a helpful assistant"
 *   onEvent={(event) => {
 *     console.log('Chat event:', event)
 *   }}
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   className="my-chat-widget"
 *   header={<h2>Customer Support</h2>}
 *   footer={<div>Powered by AI</div>}
 * />
 * ```
 *
 * @example Event tracking
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   onEvent={(event) => {
 *     if (event.type === 'message:sent') {
 *       analytics.track('message_sent', event.data)
 *     }
 *   }}
 *   onError={(error) => {
 *     console.error('Chat error:', error)
 *     toast.error(error.message)
 *   }}
 * />
 * ```
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
export interface ClarityChatAppProps {
  /** API endpoint for chat requests (required) */
  api: string
  // ... rest of interface
}
```

### Impact
- Users see relevant examples for their use case
- Copy-paste ready code
- Shows feature combinations
- IntelliSense shows examples on hover

---

## Implementation Checklist

### Priority 1: Do Today
- [ ] Quick Win 1: Add styles detection warning (5 min)
- [ ] Quick Win 2: Improve preset documentation (10 min)
- [ ] Quick Win 4: Add import guide (5 min)

**Total time: 20 minutes**
**Impact: Immediate improvement for all users**

### Priority 2: This Week
- [ ] Quick Win 3: Add generic types to ToolDefinition (15 min)
- [ ] Quick Win 5: Add configuration examples (10 min)
- [ ] Test all changes with TypeScript strict mode
- [ ] Update CHANGELOG.md

**Total time: 45 minutes**
**Impact: Better IntelliSense and examples**

### Priority 3: Review Impact
- [ ] Monitor user feedback
- [ ] Check GitHub issues for "missing styles" reports
- [ ] Track TypeScript errors related to tools
- [ ] Measure documentation page views

---

## Testing Checklist

After implementing each quick win:

### Quick Win 1 (Styles Warning)
```bash
# Test: Create app without styles import
# Expected: See warning in console

npm run dev
# Open browser console
# Should see: "[Clarity Chat] Styles not detected" warning
```

### Quick Win 2 (Preset Docs)
```typescript
// Test: Hover over preset prop
<ClarityChatApp api="/api/chat" preset="
//                                      ^ Hover here
```
Expected: See full preset documentation in tooltip

### Quick Win 3 (Generic Types)
```typescript
// Test: Type inference works
const tool: ToolDefinition<{ query: string }, { results: string[] }> = {
  name: 'search',
  execute: async (params) => {
    params.  // <- Should autocomplete with 'query'
    return { results: [] }  // <- Should type-check
  }
}
```

### Quick Win 4 (Import Guide)
```typescript
// Test: View source of index.ts
// Expected: See comprehensive import guide at top
```

### Quick Win 5 (Config Examples)
```typescript
// Test: Hover over ClarityChatAppProps
// Expected: See multiple examples in tooltip
```

---

## Rollout Plan

### Phase 1: Immediate Deploy (Today)
- Deploy Quick Wins 1, 2, 4 (no breaking changes)
- Update package version: 2.0.1
- Publish to npm

### Phase 2: Testing (This Week)
- Get feedback from early adopters
- Monitor error reports
- Gather IntelliSense feedback

### Phase 3: Full Rollout (Next Week)
- Deploy Quick Wins 3, 5
- Update documentation site
- Announce improvements in changelog

---

## Success Metrics

Track these to measure impact:

1. **Styles Warning Effectiveness**
   - Reduction in "missing styles" issues
   - Faster time to first styled component

2. **Preset Adoption**
   - Increase in preset usage vs custom config
   - Reduction in preset-related questions

3. **Tool Type Safety**
   - Reduction in tool-related TypeScript errors
   - Increase in generic usage

4. **Import Clarity**
   - Reduction in import-related issues
   - Fewer questions about which import to use

5. **Overall DX Score**
   - Target: 8.5/10 → 9.0/10
   - Measure via developer surveys

---

## Next Steps

After implementing these quick wins:

1. **Create API_REFERENCE.md** (4 hours)
   - Document all components
   - Document all hooks
   - Document all types

2. **Add Real-World Examples** (8 hours)
   - E-commerce assistant
   - Document Q&A
   - Customer support
   - Code assistant

3. **Simplify Configuration API** (1-2 days)
   - Split large interfaces
   - Reduce cognitive load
   - Improve tree-shaking

---

## Questions or Feedback?

If you have questions about implementing these quick wins:

1. Check the main DX_AUDIT_REPORT.md for context
2. Review the TypeScript types in `/packages/react/src/app-api/types.ts`
3. Test changes with existing examples in `/packages/react/src/examples/`

**Estimated total implementation time: 1 hour**
**Estimated DX score improvement: 8.2 → 8.7**
