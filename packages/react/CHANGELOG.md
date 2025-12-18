# Changelog

All notable changes to `@clarity-chat/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Public API Enhancements

- `ClarityChatProps` type is now exported for TypeScript consumers
- `useChat` hook now returns `stop()` and `reload()` methods for generation control
- `sendMessage()` in `useChat` now returns message ID (`string | null`) instead of `void`
- `useChatHandlers` now includes `onStopGeneration` handler
- Runtime development warnings for unimplemented props (`showTokenCounter`, `showNetworkStatus`,
  `enableMessageOperations`)

### Changed

#### Breaking Changes - API Consistency

- **BREAKING**: `FeedbackAnimation` component renamed to `FeedbackAnimationOverlay` to resolve
  export conflict

  ```tsx
  // Before
  import { FeedbackAnimation } from '@clarity-chat/react'
  // After
  import { FeedbackAnimationOverlay } from '@clarity-chat/react'
  ```

- **BREAKING**: `onMessageFeedback` callback signature changed to include optional comment

  ```tsx
  // Before
  onMessageFeedback?: (messageId: string, feedbackType: 'positive' | 'negative') => void
  // After
  onMessageFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  ```

- **BREAKING**: `useChat.sendMessage()` return type changed from `Promise<void>` to
  `Promise<string | null>`
  ```tsx
  // Before
  await sendMessage('Hello')
  // After
  const messageId = await sendMessage('Hello')
  ```

#### Handler Naming Consistency

- `useChatHandlers` return properties now match `ChatWindow` props exactly for spread usage:
  - `sendMessage` → `onSendMessage`
  - `clear` → `onClear`
  - `messageRetry` → `onMessageRetry`
  - `editMessage` → `onEditMessage`
  - `regenerateMessage` → `onRegenerateMessage`
  - `deleteMessage` → `onDeleteMessage`

### Fixed

- `ClarityChat` now properly passes all declared props to `ChatWindow` (previously props were
  declared but not used)
- Fixed `useChatHandlers` content type safety - now preserves `CoreMessageContent` (string or
  multi-part array) instead of coercing to string
- Fixed potential data loss in regenerate/edit operations with proper rollback on failure

### Deprecated

- Props `autoScroll`, `theme`, `showTokenCounter`, `showNetworkStatus`, `enableMessageOperations` on
  `ClarityChat` are accepted but log warnings in development mode as they are not yet fully
  implemented

### Added

#### React 19 Ref Utilities

- `useMergedRef` hook for merging multiple refs (internal + external)
- `mergeRefs` function for non-hook ref merging
- `useMergedRefWithCleanup` hook supporting React 19 ref cleanup functions
- `assignRef` utility for manually setting ref values

### Changed

#### React 19 Component Refactoring

- **BREAKING**: Migrated 13 files (17 components) from `forwardRef` to React 19 ref-as-prop pattern
- Components now accept `ref` as a standard prop instead of using `forwardRef` wrapper
- Affected components:
  - `AdvancedChatInput` - Uses new `useMergedRef` for internal/external ref merging
  - `MessageOptimized` - Refactored with custom `React.memo` comparison
  - `CommandPalette` - Direct ref-as-prop
  - `ContextMenu` - Direct ref-as-prop
  - `KeyboardHint` - Direct ref-as-prop
  - `ThemeSwitcher` - Direct ref-as-prop
  - `Draggable` / `DropZone` - Both components refactored
  - `DashboardProgress` - Direct ref-as-prop
  - `InteractiveCard` / `InteractiveCardButton` - Both components refactored
  - `OutputPreferenceSelector` (Uncontrolled) - Direct ref-as-prop
  - `CalendarIntegration` - Direct ref-as-prop
  - `DocumentIntegration` - Direct ref-as-prop
  - `EmailIntegration` - Direct ref-as-prop

#### Migration Guide

For existing code using these components with refs:

```tsx
// Before (React 18 with forwardRef)
const MyWrapper = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <CommandPalette ref={ref} {...props} />
))

// After (React 19 ref-as-prop)
function MyWrapper({ ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> }) {
  return <CommandPalette ref={ref} {...props} />
}
```

The external API remains compatible - refs passed to these components work the same way.

### Testing

- Added comprehensive tests for `useMergedRef` hook
- Added ref forwarding tests for refactored components

## [1.0.0] - 2024-12-09

### Release Highlights

First public npm release of the Clarity Chat component library. Production-ready for commercial use.

### Added

#### TypeScript Declaration Files (DTS)

- Full TypeScript declaration generation for all packages
- Proper type inference and IntelliSense support
- Fixed all type export issues for seamless IDE integration

#### Package Documentation

- JSDoc documentation headers for all packages
- Comprehensive API documentation in main exports
- Type documentation with examples

#### Security & Compliance

- SECURITY.md with vulnerability disclosure policy
- PR template with security review checklist
- Public access configuration for npm publishing

### Changed

#### Type System Improvements

- Renamed `ModelConfig` to `TokenModelConfig` to avoid export collisions
- Created `PricingProvider` type for model pricing subsystem
- Fixed framer-motion Easing types (array format compatibility)
- Updated Tooltip exports for proper content prop support

#### Component Fixes

- Fixed DialogContent props (removed unsupported size/animation)
- Updated button-enhanced with surface, success, error variants
- Fixed template timestamp handling in message operations

### Fixed

#### Build System

- Enabled DTS generation in tsup.config.ts
- Added @types/node for process.env support
- Rebuilt primitives package for Button state prop

#### Test Suite

- Fixed test isolation in error-handling package
- Added proper mock cleanup (vi.restoreAllMocks)
- All core package tests passing

### Dependencies

- Added @types/node to @clarity-chat/react

---

## [0.1.0] - Phase 3 Complete

### Added - Phase 3: Structured Output & Tool UI Registry

#### Structured Output

- `useClarityObject<T>` hook for type-safe object generation
  - Generic type support for type-safe object generation
  - Streaming and non-streaming modes
  - Automatic JSON parsing from streams
  - Error handling and loading states
  - Input management and reset functionality
  - Callback support (onFinish, onError, onProgress)

#### Tool UI Registry

- `createToolUIRegistry` function for type-safe component mapping
- `ClarityToolResult` component for automatic tool result rendering
  - Type-safe component mapping
  - Automatic tool result rendering
  - Fallback rendering for unregistered tools
  - Message context integration
  - Customizable props and styling

#### Examples

- `product-recommendation-object.tsx` - Structured output example
- `generative-ui-tools.tsx` - Basic tool registry example
- `generative-ui-integrated.tsx` - Full integration example

#### Tests

- `use-clarity-object.test.tsx` - 11 test cases
- `clarity-tool-result.test.tsx` - 6 test cases

#### Documentation

- Phase 3 README
- Phase 3 Examples guide
- Phase 3 Summary (comparison to Vercel AI SDK)
- Phase 3 Complete status
- Phase 3 Accomplishments summary

### Changed

- Updated exports in `index.ts` to include Phase 3 APIs
- Enhanced type definitions for tool UI registry

## [0.0.9] - Phase 2 Complete

### Added - Phase 2: useClarityChat Implementation

#### Flagship Hook

- `useClarityChat` - Primary public API for chat functionality
  - Full Vercel AI SDK compatibility
  - Memory integration (3 strategies)
  - Transport selection (SSE/WebSocket)
  - Context summary generation
  - Auto memory capture

#### Memory Integration

- Three memory strategies:
  - `sliding-window` - Fast, recent context
  - `semantic-chunks` - Context-aware selection
  - `vector-store` - Long-term memory with embeddings
- Memory context injection
- Memory summary generation

#### Transport Protocols

- Server-Sent Events (SSE) - Default HTTP-based streaming
- WebSocket - Real-time bidirectional communication

#### Examples

- `basic-clarity-chat-example.tsx` - Simple chat example
- `advanced-clarity-chat-example.tsx` - Advanced features example
- Showcase example app

#### Documentation

- Quick Start guide
- Migration Guide (Vercel AI SDK)
- API Reference
- TypeScript Guide
- Performance Guide
- useClarityChat README
- Documentation Index

#### Tests

- Enhanced test coverage for `useClarityChat`
- Memory integration tests
- Transport protocol tests

### Changed

- Updated `useChatEnhanced` integration
- Enhanced message conversion utilities
- Improved type definitions

## [0.0.8] - Phase 1 Complete

### Added - Phase 1: Audit & Comparison

#### Audit Report

- Comprehensive feature map of Clarity's React library
- Parity matrix vs Vercel AI SDK UI
- Identification of 5-10 clear differentiators
- Detailed comparison report

### Documentation

- `CLARITY_VS_VERCEL_AI_SDK_AUDIT.md` - Complete audit report

## [0.0.7] - Pre-Phase 1

### Added

- Core chat hooks (`useChat`, `useChatEnhanced`)
- Chat components (`ChatWindow`, `ChatInput`, `VirtualizedMessageList`)
- Memory system integration
- Agent orchestration
- Streaming hooks (SSE, WebSocket)
- Error handling and recovery
- UI components and utilities

### Features

- Production-ready chat UI components
- Advanced streaming support
- Memory management system
- Agent orchestration with tools
- Error recovery mechanisms
- Accessibility features
- Responsive design

---

## Migration Guides

### From Vercel AI SDK

See [Migration Guide](./MIGRATION_GUIDE.md) for detailed migration instructions.

### Breaking Changes

None yet. This is the initial release.

---

## Links

- [Getting Started](./GETTING_STARTED.md)
- [API Reference](./API_REFERENCE.md)
- [Documentation Index](./DOCUMENTATION_INDEX.md)
- [All Phases Summary](./ALL_PHASES_SUMMARY.md)
