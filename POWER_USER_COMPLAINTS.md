# POWER_USER_COMPLAINTS.md

## A Senior React Developer's Honest Assessment of @clarity-chat/react

**Author**: A developer who has shipped chat UIs at scale and does not have time for this.

**Date**: 2026-02-19

**Time Spent Evaluating**: Too much. That is itself a complaint.

---

## 1. The Public API Is a Lie

The file `packages/react/src/public-api.ts` starts with a cheerful comment: "Core Package (Essential Components) ... essential 15 exports."

It then proceeds to export **well over 100 symbols**.

The numbering system in the comments tells the whole story:

```
// 1. Primary Component
// 2. Primary Hook
// ...
// 5.5. Code Block          <-- Already cheating the numbering
// ...
// 8. Memory Features
// 8.5. Toast/Notification System
// 8.6. Additional Hooks
// 8.7. Message Components
// 8.8. Chat Components
// 8.9. UI Components
// 8.10. Media Components
// 8.11. Input Components
// 8.12. Token Components
// 8.13. Feedback Components
// 8.14. Keyboard Hooks
// 8.15. Accessibility Hooks
// 9. Command Palette
// 10. Search
// 11. Prompts
```

Sections 8 through 8.15 are doing more work than most entire libraries. This is not "15 exports." This is a developer who could not say no to any feature request.

On top of that, there are entire sections for:
- `UNIFIED CONTEXT PROVIDERS` (ClarityChatProvider, AgentExecutionProvider)
- `COMPOSITION COMPONENTS` (ChatComposer, MessageRenderer, AgentPanel)
- `CONNECTED COMPONENT HOOKS` (8 more hooks)
- `SDK BRIDGE HOOKS` (4 bridges: Vercel AI, LangChain, Anthropic, Generic)
- `ADAPTERS` (more adapter exports)

This is not a "core" package. This is the entire kitchen, including the pantry, the appliances, and someone else's refrigerator.

**Verdict**: The claim of "15 exports for 90% of use cases" is fiction. The actual export surface is enormous and contradicts the marketed simplicity.

---

## 2. Bundle Size: 650KB Is Absurd. Actually, It Is Worse Than That.

From `.size-limit.cjs`:

```js
{
  name: 'Main Bundle (ESM)',
  path: 'dist/index.mjs',
  limit: '350 KB',  // gzip
},
{
  name: 'Main Bundle (CJS)',
  path: 'dist/index.js',
  limit: '1.4 MB',  // raw
}
```

The main ESM bundle is capped at **350 KB gzipped**. That is roughly **1.2 MB uncompressed**. For chat components.

The CJS bundle cap is **1.4 MB raw**. For context, the entirety of `react` + `react-dom` is about 130 KB minified+gzipped.

This library's stated "Phase 2 baseline" after externalization is **1180 KB (304 KB gzip)**. They celebrate a "73% reduction from Phase 1," meaning Phase 1 was presumably around 4.3 MB. That is not an improvement. That is still a disaster with a better press release.

The dependency list in `package.json` tells the story:

**Hard dependencies** (not peer, not optional, shipped with the package):
- `@radix-ui/react-slot`
- `@tanstack/react-virtual`
- `isomorphic-dompurify` (DOMPurify for server and client -- heavyweight)
- `react-resizable-panels`
- `react-virtualized-auto-sizer`
- `react-window`
- `sonner` (toast library -- why is this a hard dependency?)

**Required peer dependencies** (must install):
- `framer-motion` (~35 KB gzipped)
- `lucide-react` (~icon library)
- `zod` (~13 KB gzipped)

**Optional peer dependencies** (20 of them):
- `flowtoken`, `mermaid`, `pdfjs-dist`, `mammoth`, `cohere-ai`, `shiki`, `jszip`, `prismjs`, `react-markdown`, `remark-gfm`, `rehype-highlight`, `date-fns`, `recharts`, `class-variance-authority`, `react-window`, `react-virtualized-auto-sizer`

I need `framer-motion` and `zod` as required dependencies to render a chat bubble. `framer-motion` alone is 35+ KB gzipped. I do not animate chat bubbles in production. I cannot opt out.

Also: `react-window` and `react-virtualized-auto-sizer` appear as both **direct dependencies** AND **peer dependencies**. Pick one.

**Verdict**: A chat component library should be 30-50 KB gzipped at most for the core. This one is 6-10x that.

---

## 3. Over-Engineering: Where Do I Start?

### 3.1. Every File Exists Twice

Inside `packages/react/src/components/chat/`, every single component file exists in both PascalCase and kebab-case:

```
ChatInput.tsx         <->   chat-input.tsx
ChatWindow.tsx        <->   chat-window.tsx
ChatLayout.tsx        <->   chat-layout.tsx
ChatSyncStatus.tsx    <->   chat-sync-status.tsx
ClarityChat.tsx       <->   clarity-chat.tsx
EmptyState.tsx        <->   empty-state.tsx
FloatingChatWidget.tsx <->  floating-chat-widget.tsx
...
```

The same pattern repeats in `components/message/`. Both versions contain the same component with slightly different imports. This is not a migration path. This is two developers who disagreed on naming conventions and both committed their code.

**654 non-test component files** across 248 directories. 1,765 total TypeScript files. For a chat library.

### 3.2. The Type System Is an Enterprise Architecture Astronaut's Dream

The `types/` directory contains:

- `chat-types.ts` - Type definitions and a `TypedMessageBuilder` class
- `chat-types-improved.ts` - "Improved" type definitions (because the first ones were not good enough, apparently)
- `clarity-chat-types.ts` - Even more type definitions
- `messages.ts` - UIMessage/ModelMessage separation
- `enhanced.ts` - 1,019 lines of "enhanced" types including `StrictChatEvent`, `GenericMessage<TMetadata>`, `PluginConfig`, `PluginManager`, `createPropsBuilder`, `deepFreeze`, `createStrictEventEmitter`
- `intellisense-helpers.ts` - Types for IntelliSense (types for types)
- `tool-definition.ts`, `tool-invocation.ts`, `tool-result-types.ts`, `tool-status.ts` - Four separate files for tool types

The `enhanced.ts` file alone exports a `createPropsBuilder()` function that is a fluent builder pattern for React props. Nobody asked for this. Nobody will use this. The `deepFreeze` utility lives in a types file. `createStrictEventEmitter()` is a full event emitter implementation in a types file.

`TypedMessageBuilder` is a class with static methods to create message objects. In a React library. In 2026. When a simple function would do:

```ts
// What they built:
const msg = TypedMessageBuilder.user("Hello")

// What everyone actually writes:
const msg = { role: 'user', content: "Hello" }
```

`MessageValidator` is another class that validates message objects at runtime, checking if `.role` is in a hardcoded array. TypeScript already does this at compile time. That is the point of TypeScript.

### 3.3. Adapter and Bridge Proliferation

The public API exports:
- `createVercelAIAdapter`
- `createBaseClarityChatAdapter`
- `withClarityChatEvents`
- `useVercelAIBridge`
- `useLangChainBridge`
- `useAnthropicBridge`
- `useGenericBridge`

Plus a `ClarityChatProvider` and an `AgentExecutionProvider`. Plus connected hooks for every component. Plus `ChatComposer` with slots. Each of these is a different "integration strategy." The API provides at least four distinct ways to connect a chat to a backend:

1. `useClarityChat({ api: '/api/chat' })` - hook-based
2. `ClarityChatProvider` + connected components - context-based
3. Bridge hooks (useVercelAIBridge, etc.) - adapter pattern
4. `ClarityChatApp` - drop-in component

Four paradigms. The documentation says "pick the one that fits your architecture." The correct answer is: one paradigm, done well.

### 3.4. Consent Management in a Chat Hook

`useClarityChat` has built-in GDPR consent management for memory storage:

```ts
const requireConsent = memory.requireConsent ?? true
if (requireConsent) {
  if (consentGranted === null && !consentRequestedRef.current) {
    consentRequestedRef.current = true
    const consent = memory.onConsentRequired
      ? await Promise.resolve(memory.onConsentRequired())
      : false
    setConsentGranted(consent)
```

A chat hook should not be managing GDPR consent flows. This is application-level logic being absorbed into a UI component library.

---

## 4. Missing Features a Power User Actually Expects

Despite 654 component files, the library is missing:

1. **No `useActionState` support** - React 19's `useActionState` is the correct primitive for form submissions. Only one file in the entire codebase references it, an example file. The ChatInput still uses manual state management with `useState` and `handleSubmit`.

2. **No Server Components** - Everything is `'use client'`. 710 files have the `'use client'` directive. There is zero Server Component support. In 2026, with React 19+ and Server Components being the standard, this is a significant gap. Message rendering, markdown processing, and code highlighting should be server-renderable.

3. **No `ref` forwarding on major components** - Only 18 files use `forwardRef` across 654 component files. `ChatWindow`, `ChatInput`, `MessageBubble`, `StreamingMessage` -- none of them forward refs. In React 19, ref is a regular prop. This library is not using it.

4. **No headless mode** - Every component comes with opinions about styling. There is no way to use the logic without the UI. Compare with Radix UI or Headless UI or @ai-sdk/ui which give you state + hooks and let you render whatever you want.

5. **No streaming cancellation via AbortController** - The `onStopGeneration` is a callback prop, not integrated with AbortController which is the Web Platform standard.

6. **No optimistic updates** - Despite having a `use-optimistic-message.ts` file somewhere, the main `useClarityChat` hook does not surface optimistic UI capabilities.

---

## 5. TypeScript Experience

### The Good

- Discriminated union types for events in `enhanced.ts` are well-designed
- JSDoc comments are thorough, sometimes excessively so
- The `UseClarityChatReturn` type properly extends `UseChatEnhancedReturn`

### The Bad

- `MessageRole` is defined in at least 5 different files with subtly different unions:
  - `MessageBubble.tsx`: `'user' | 'assistant' | 'system'`
  - `ClarityChatProvider.tsx`: `'user' | 'assistant' | 'system' | 'tool'`
  - `chat-types-improved.ts`: `'user' | 'assistant' | 'system'`
  - `clarity-chat-types.ts`: `CoreMessage['role']` (derived)
  - `enhanced.ts`: uses `MessageRole` from adapters (different again)

  Which one do I import? They are all subtly incompatible.

- Three separate "message" type hierarchies that do not interoperate cleanly:
  - `Message` from `@clarity-chat/types`
  - `CoreMessage` from `use-chat-enhanced`
  - `UIMessage` from `messages.ts`
  - `ChatMessage` from `ClarityChatProvider`
  - `GenericMessage<TMetadata>` from `enhanced.ts`

  The `ChatWindow` accepts `Message[] | CoreMessage[]` and then normalizes internally with `useMessageNormalization`. This is a red flag -- if your types are right, you do not need runtime normalization.

### The Ugly

- `const ListComponent = List as any` in `VirtualizedMessageList.tsx`. Literally casts the core virtualization component to `any`.
- The `createPropsBuilder` function returns `Partial<T>` but has a `toRequired()` method that casts `Partial<T> as T` and then does a runtime check. This defeats the purpose of TypeScript.

---

## 6. Composability Assessment

The library offers three competing composition models:

1. **Monolithic**: `ClarityChatApp` - a single component that does everything. Not composable at all.

2. **Prop-drilling**: `ChatWindow` - takes 40+ props (including 20+ deprecated ones kept for backward compatibility). The grouped props pattern (`messageActions`, `editActions`, `header`, `actions`, `errorHandling`, `prompts`) is then merged with legacy flat props at runtime via `useMemo`. This is not composition; this is a configuration object with extra steps.

3. **Slot-based**: `ChatComposer` - a slot-based composition system with `ChatComposer.Header`, `ChatComposer.Messages`, etc. This is the most idiomatic React approach but it requires `ClarityChatProvider`, creating another abstraction layer.

None of these work like this:

```tsx
// What a power user wants:
const { messages, send, isStreaming } = useChat({ api: '/api/chat' })

return (
  <div>
    {messages.map(m => <MyCustomBubble key={m.id} message={m} />)}
    <input onSubmit={send} />
  </div>
)
```

Instead, the library fights you at every turn by wanting you to use its components, its providers, its adapters, its rendering pipeline.

---

## 7. Performance Concerns

### 7.1. Framer Motion on Every Message

`MessageBubble`, `StreamingMessage`, `ChatInput`, `ChatWindow`, and virtually every visible component uses `framer-motion` for animations. Every message mount triggers:

```tsx
<motion.article
  {...ANIMATION_PRESETS.slideUp}
  transition={{ duration: DURATION_SECONDS.fast, ease: EASING_FRAMER.out }}
>
```

With 100+ messages, that is 100+ motion components with layout calculations on mount. The `useReducedMotion` hook is used to disable animations, but the `motion` components are still instantiated. Each one carries the overhead of Framer Motion's measurement system.

### 7.2. Two Virtualization Solutions

The library ships both `react-window` (VirtualizedMessageList) and `@tanstack/react-virtual` (TanstackMessageList) as direct dependencies. Both solve the same problem. Both are imported. The `VirtualizedMessageList` is the default export in `public-api.ts`, but TanStack is the modern choice. The library made you pay for both.

### 7.3. DOMPurify in Every Build

`isomorphic-dompurify` is a hard dependency. It is approximately 60 KB minified. It ships with every installation even if you never render user-generated HTML. This should be optional.

### 7.4. `useSmoothStreaming` Runs requestAnimationFrame Per Message

The `StreamingMessage` component has a `useSmoothStreaming` hook that runs a `requestAnimationFrame` loop for character-by-character reveal animation. With multiple concurrent streams, this is multiple rAF loops competing for the main thread, each doing `setDisplayedContent` on every frame -- triggering React reconciliation 60 times per second per streaming message.

---

## 8. What I Would Build Instead

```tsx
// The entire API surface I need:
import { useChat, type Message } from '@my/chat'

function Chat() {
  const { messages, send, stop, isStreaming, error } = useChat({
    endpoint: '/api/chat',
  })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id} className={m.role === 'user' ? 'user' : 'assistant'}>
          {m.content}
        </div>
      ))}
      {isStreaming && <span>...</span>}
      <form onSubmit={e => { e.preventDefault(); send(new FormData(e.target)) }}>
        <textarea name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

Total bundle size: approximately 5 KB. Total components: 0 (you bring your own). Total peer dependencies: 0. Total time to understand the API: 30 seconds.

Add markdown rendering when you need it. Add virtualization when you hit 500+ messages. Add animations when your designer asks. Do not pay for all of it upfront.

This is what Vercel's `ai` package got right. This is what this library got catastrophically wrong.

---

## 9. Specific Code Anti-Patterns Found

### 9.1. `as any` in core virtualization code
**File**: `packages/react/src/components/chat/VirtualizedMessageList.tsx`
```ts
const ListComponent = List as any
```

### 9.2. Runtime validation duplicating TypeScript
**File**: `packages/react/src/components/chat/ChatInput.tsx`
```ts
if (process.env.NODE_ENV === 'development') {
  try {
    validateStringProp(value, 'value', 'ChatInput')
    validateFunctionProp(onChange, 'onChange', 'ChatInput')
    validateFunctionProp(onSubmit, 'onSubmit', 'ChatInput')
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error) // double-checking NODE_ENV inside a NODE_ENV block
    }
  }
}
```

### 9.3. Unused result from retryWithBackoff
**File**: `packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`
```ts
if (memory.retryOnError !== false) {
  const { result } = await retryWithBackoff(storeMemory, {
    maxRetries: (memory.maxRetryAttempts || 2) - 1,
    baseDelay: 500,
  })
  // `result` is destructured but never used
}
```

### 9.4. Effect dependency on entire messages array
**File**: `packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`
```ts
React.useEffect(() => {
  // prompt optimization effect
}, [
  promptOptimization?.enabled,
  chat.messages, // <-- entire array reference, triggers on every message
  // ...
])
```

This effect re-runs every time any message changes, including during streaming. The 500ms setTimeout debounce is a band-aid.

### 9.5. Inline styles in a component library
**File**: `packages/react/src/app-api/ClarityChatApp.tsx`
```tsx
<div style={{
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: isUser ? '#0066cc' : '#f0f0f0',
  color: isUser ? 'white' : 'black',
}}>
```

Hardcoded hex colors. No theming. No CSS variables. In a default renderer that claims to be "drop-in."

### 9.6. Five message type systems
As documented in section 5, `Message`, `CoreMessage`, `UIMessage`, `ChatMessage`, and `GenericMessage<T>` all coexist with runtime normalization bridges between them.

### 9.7. `viewport={{ once: true }}` on non-scroll animations
Multiple `motion.div` components use `viewport={{ once: true }}` on elements that are not scroll-triggered. This property is for Intersection Observer-based animations. Applied to standard mount animations, it is a no-op at best and confusing at worst.

---

## 10. Power User Satisfaction Score

| Category                    | Score (1-10) | Notes                                                   |
|-----------------------------|:------------:|---------------------------------------------------------|
| API Simplicity              |      2       | 100+ exports labeled "core 15"                          |
| Bundle Size                 |      1       | 350 KB gzipped for chat components is indefensible      |
| TypeScript DX               |      4       | Good JSDoc, but 5 competing message types               |
| Composability               |      3       | Three composition models, none are headless              |
| Performance                 |      3       | Framer Motion on every element, dual virtualization      |
| Documentation Accuracy      |      2       | "15 exports" claim, "90% of use cases"                  |
| React Idioms                |      3       | No Server Components, no useActionState, minimal refs    |
| Extensibility               |      5       | Plugin system exists but is over-engineered              |
| Code Quality                |      3       | Duplicate file naming, `as any`, unused variables        |
| Would I Use This?           |      2       | I would use `@ai-sdk/ui` + my own components            |

**Overall Score: 2.8 / 10**

This library has the ambition of a design system, the scope of an application framework, and the bundle size of a small SPA. It tries to be everything to everyone and succeeds at being too much for anyone.

The core problem is not technical skill -- the code quality within individual files is generally competent. The problem is architectural: an inability to draw boundaries, say no to features, and maintain a focused API surface. A chat component library does not need consent management, plugin systems, event emitters, DOCX loaders, vector search, A/B testing, prompt marketplaces, and dual virtualization solutions.

Ship the hook. Ship the types. Let me build my own UI.

---

*Written while waiting for `pnpm install` to finish resolving 20 peer dependencies.*
