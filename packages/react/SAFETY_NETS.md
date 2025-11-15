# Safety Nets & Runtime Protections

## Overview

This document lists all runtime protections, validations, and safety nets added to Clarity Chat APIs to ensure developer-friendly error messages and prevent common mistakes.

**Last Updated**: Phase 4 Safety Hardening

---

## Runtime Validations Added

### 1. API Endpoint Validation

**Location**: `utils/runtime-validation.ts` → `validateApiEndpoint()`

**Protected APIs**:
- `ClarityChat` component
- `useChat` hook
- `ChatWithMemory` component
- All recipe components

**Validation**:
- ✅ Checks that `api` prop/option is provided
- ✅ Validates it's a non-empty string
- ✅ Warns about localhost endpoints (dev mode)

**Error Message Example**:
```
[ClarityChat] Missing required prop "api". 
Please provide an API endpoint: <ClarityChat api="/api/chat" />
```

---

### 2. Component Prop Validation

**Location**: `components/chat-window.tsx`

**Protected Props**:
- `messages` - Must be an array
- `onSendMessage` - Must be a function

**Validation**:
- ✅ Checks `messages` is provided and is an array
- ✅ Checks `onSendMessage` is provided and is a function

**Error Message Example**:
```
[ChatWindow] Missing required prop "messages". 
Please provide an array of messages: <ChatWindow messages={messages} />
```

---

### 3. Enum/Strategy Validation

**Location**: `components/chat-recipes.tsx` → `ChatWithMemory`

**Protected Props**:
- `strategy` - Must be one of: 'sliding-window', 'semantic-chunks', 'vector-store'

**Validation**:
- ✅ Validates strategy is one of allowed values
- ✅ Provides clear list of valid options

**Error Message Example**:
```
[ChatWithMemory] Invalid "strategy" prop. 
Expected one of: sliding-window, semantic-chunks, vector-store, got: invalid-strategy
```

---

### 4. Storage Key Validation

**Location**: `hooks/use-chat-unified.ts`

**Protected Options**:
- `storageKey` - Must be a non-empty string (if persistence enabled)

**Validation**:
- ✅ Validates storage key format
- ✅ Warns (doesn't throw) if invalid, uses default

**Warning Example**:
```
[useChat] Invalid "storageKey" option. 
Expected a non-empty string, using default: "clarity-chat"
```

---

### 5. Provider Context Validation

**Location**: `memory/memory-provider.tsx` → `useMemory()`

**Protected Hooks**:
- `useMemory()` - Requires `MemoryProvider`
- `useMemoryQuery()` - Requires `MemoryProvider`
- `useMemoryStats()` - Requires `MemoryProvider`
- `useConversationMemory()` - Requires `MemoryProvider`

**Validation**:
- ✅ Checks provider is available in context
- ✅ Provides clear setup instructions

**Error Message Example**:
```
[useMemory] MemoryProvider is not available. 
Please wrap your component with <MemoryProvider> to use this hook.

Example:
  <MemoryProvider config={{ maxTokens: 10000 }}>
    <YourComponent />
  </MemoryProvider>
```

---

## Fallbacks & Guards

### 1. Null/Undefined Input Guards

**Location**: Various components and hooks

**Protections**:
- ✅ Default values for optional props
- ✅ Null checks before operations
- ✅ Graceful degradation

**Examples**:
- `chatId` defaults to `'default'`
- `autoScroll` defaults to `true`
- `isLoading` defaults to `false`
- `showHeader` defaults to `false`

---

### 2. Failed Async Operation Handling

**Location**: `hooks/use-chat-unified.ts`, `hooks/use-clarity-chat.ts`

**Protections**:
- ✅ Try-catch blocks around async operations
- ✅ Error state management
- ✅ User-friendly error messages
- ✅ Retry mechanisms (where applicable)

**Examples**:
- localStorage operations wrapped in try-catch
- API calls have error handling
- Network errors provide actionable messages

---

### 3. Missing Dependency Guards

**Location**: Provider-based hooks

**Protections**:
- ✅ Provider availability checks
- ✅ Clear error messages with setup instructions
- ✅ Graceful fallbacks where possible

**Examples**:
- `useMemory()` checks for `MemoryProvider`
- `useAnalytics()` checks for `AnalyticsProvider`
- Error messages include setup examples

---

## Error Message Standards

### Format

All error messages follow this format:
```
[ComponentName] Problem description. 
Actionable solution or example.
```

### Principles

1. **Clear**: State what's wrong
2. **Actionable**: Tell how to fix it
3. **Contextual**: Include component/hook name
4. **Helpful**: Provide examples when possible

### Examples

**Good**:
```
[ClarityChat] Missing required prop "api". 
Please provide an API endpoint: <ClarityChat api="/api/chat" />
```

**Bad**:
```
api is required
```

---

## Dev-Mode Warnings

### Localhost Detection

**Location**: `utils/runtime-validation.ts`

**Warning**:
```
[ClarityChat] Using localhost API endpoint. 
Make sure your API server is running and accessible.
```

### Invalid Storage Key

**Location**: `hooks/use-chat-unified.ts`

**Warning**:
```
[useChat] Invalid "storageKey" option. 
Expected a non-empty string, using default: "clarity-chat"
```

---

## Validation Utilities

### `validateApiEndpoint()`
- Validates API endpoint is provided and is a non-empty string
- Warns about localhost endpoints

### `validateRequiredString()`
- Validates required string props
- Provides clear error messages

### `validateEnum()`
- Validates enum/union type props
- Lists valid options in error message

### `validateProvider()`
- Validates provider is available in context
- Provides setup instructions

### `validateFunction()`
- Validates callback functions
- Provides type error messages

### `validateStorageKey()`
- Validates storage key format
- Warns (doesn't throw) for invalid keys

---

## Coverage Summary

### Top-Level APIs
- ✅ `ClarityChat` - API validation
- ✅ `ChatWithMemory` - API + strategy validation
- ✅ `useChat` - API + storage key validation
- ✅ `ChatWindow` - Messages + callback validation

### Provider-Based Hooks
- ✅ `useMemory()` - Provider validation
- ✅ `useMemoryQuery()` - Provider validation (via useMemory)
- ✅ `useAnalytics()` - Provider validation (needs improvement)

### Mid-Level APIs
- ⏳ `useClarityChat` - Basic validation (could be enhanced)
- ⏳ `ChatInput` - Basic validation (could be enhanced)

---

## Future Enhancements

### Planned
- [ ] Enhanced validation for `useClarityChat` options
- [ ] Validation for `ChatInput` props
- [ ] Validation for `Message` component props
- [ ] Type-safe validation helpers
- [ ] Dev-mode only validations (stripped in production)

---

**Status**: ✅ Core validations complete  
**Coverage**: Top-level APIs fully protected  
**Next**: Enhance mid-level API validations
