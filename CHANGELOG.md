# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation restructure with new `/docs` folder
- CI/CD pipeline with GitHub Actions (test, build, accessibility, security)
- Automated release workflow with Changesets
- Bundle size monitoring with size-limit
- Pre-commit hooks with Husky and lint-staged
- Coverage reporting with Codecov
- Architecture diagrams with Mermaid
- Getting started guides (installation, quick start, first component)

### Changed
- Moved phase documentation to `.archive/phases/` for cleaner root
- Updated main README with improved structure and badges
- Enhanced project organization and discoverability

### Fixed
- Documentation organization and navigation

## [0.1.0] - 2024-10-30

### Added

#### Phase 4: Extended Features
- **Voice Input System**
  - `VoiceInput` component with speech-to-text
  - `useVoiceInput` hook with multi-language support
  - Real-time transcription with interim results
  - Auto-submit on speech end
  - Browser compatibility detection

- **Mobile Keyboard Handling**
  - `useMobileKeyboard` hook for keyboard detection
  - `useMobileViewportHeight` for stable viewport
  - Auto-scroll to focused inputs
  - iOS and Android support

- **Glassmorphism Theme**
  - Modern glass effect design
  - Blur and transparency effects
  - Added to theme selector

- **Pre-built Templates**
  - SupportBot template with FAQ matching
  - CodeAssistant template with syntax highlighting
  - Ready-to-use starting points

- **Context Visualizer**
  - Show what AI "sees" in context window
  - Token usage display
  - Context management UI

- **Conversation List**
  - Search and filter conversations
  - Pin and favorite features
  - Archive and delete functionality

#### Phase 3: Advanced Features
- **Advanced Theme System**
  - 8 built-in themes (default, dark, ocean, sunset, forest, corporate, neon, minimal)
  - Live theme editor with color pickers
  - Theme preview component
  - Theme selector with visual previews

- **WCAG 2.1 AAA Accessibility**
  - Screen reader optimization
  - Keyboard shortcuts system (Shift+?)
  - Focus management (trap, roving tabindex, restoration)
  - Contrast checking utilities
  - ARIA validation

- **Analytics Integration**
  - 7 analytics providers (GA4, Mixpanel, PostHog, Amplitude, Segment, Custom, Console)
  - 35+ predefined events
  - Auto-tracking for page views and errors
  - 10 tracking hooks
  - A/B testing support
  - Funnel tracking utilities

- **Performance Monitoring**
  - Real-time performance dashboard
  - Render performance metrics
  - Memory tracking and leak detection
  - Component render timing

- **Error Tracking & Monitoring**
  - 6 error providers (Sentry, Rollbar, Bugsnag, LogRocket, Custom, Console)
  - Enhanced error boundaries with automatic reporting
  - User feedback collection
  - Breadcrumb system for debugging
  - Error statistics
  - Offline error storage

- **AI Features**
  - Smart suggestions (quick replies, commands, completions)
  - Content moderation (profanity filter, PII detection)
  - Sentiment analysis with confidence scoring
  - Auto-complete with context awareness
  - 8 built-in AI providers

#### Phase 2: Core Features & Enhancement
- **Message Operations**
  - Message editing with history
  - Message regeneration
  - Conversation branching
  - Undo/redo functionality

- **Performance Optimization**
  - Virtualized message lists for 1000+ messages
  - Code splitting support
  - Tree-shaking enabled
  - Bundle size optimization

- **Error Handling**
  - ErrorBoundary with automatic retry
  - Exponential backoff strategy
  - RetryButton component
  - Network status monitoring
  - useErrorRecovery hook

- **Token Management**
  - Real-time token counter
  - Cost estimation
  - Token tracking hook
  - Usage dashboard

- **Advanced Components**
  - AdvancedChatInput with autocomplete
  - FileUpload with drag & drop
  - ContextManager for documents
  - ProjectSidebar for organization
  - PromptLibrary with templates
  - KnowledgeBaseViewer
  - ExportDialog (PDF, DOCX, Markdown)

#### Phase 1: Foundation
- **Core Components**
  - ChatWindow - Full-featured chat interface
  - MessageList - Scrollable message container
  - Message - Rich message display with markdown
  - ChatInput - Basic message input
  - ThinkingIndicator - AI processing states
  - CopyButton - Copy message content

- **Streaming Support**
  - Server-Sent Events (SSE)
  - WebSocket streaming
  - Stream cancellation
  - Reconnection handling

- **Hooks**
  - useChat - Main chat state management
  - useStreaming - Real-time streaming
  - useAutoScroll - Smart scrolling
  - useClipboard - Copy to clipboard
  - useDebounce/useThrottle - Rate limiting
  - useLocalStorage - Persistent state

- **Type System**
  - Complete TypeScript definitions
  - Strict mode enabled
  - Message, User, Chat types
  - Context and Attachment types

- **Testing**
  - Vitest setup
  - React Testing Library
  - jest-axe for accessibility
  - 28 initial tests

- **Documentation**
  - Storybook setup
  - Component stories
  - README and examples
  - Architecture documentation

### Changed
- Upgraded to React 19.0.0
- Upgraded to TypeScript 5.7.2
- Upgraded to Vite 6.0.5
- Improved monorepo structure with Turborepo

### Fixed
- Message rendering performance
- Streaming connection stability
- Error boundary reset issues
- Theme switching transitions

## [0.0.1] - 2024-10-01

### Added
- Initial project setup
- Monorepo structure with npm workspaces
- Basic TypeScript configuration
- Package scaffolding

---

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### Creating a changeset

```bash
npx changeset
```

### Publishing

Releases are automated through GitHub Actions when changes are merged to `main`.

---

[Unreleased]: https://github.com/christireid/Clarity-ai-chat-components/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/christireid/Clarity-ai-chat-components/releases/tag/v0.1.0
[0.0.1]: https://github.com/christireid/Clarity-ai-chat-components/releases/tag/v0.0.1
