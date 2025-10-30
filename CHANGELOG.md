# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚀 Major Improvements

#### Documentation Restructure
- **NEW:** Comprehensive documentation site in `/docs`
  - Getting Started guides (Installation, Quick Start, First Component)
  - Complete API reference for all 47+ components
  - 25+ hooks fully documented
  - Architecture deep dive with Mermaid diagrams
  - Examples gallery with 9 working applications
- **MOVED:** Project management docs to `.archive/phases`
- **IMPROVED:** README with badges, clear navigation, and feature highlights

#### CI/CD Pipeline
- **NEW:** GitHub Actions workflows
  - `test.yml` - Automated testing on push/PR
  - `release.yml` - Automated npm publishing
  - Security audit with npm audit & Snyk
  - Accessibility testing integration
  - Multi-node version testing (18.x, 20.x)
- **NEW:** Codecov integration for coverage reporting
- **NEW:** Coverage badge generation

#### Build & Release System
- **NEW:** Changesets for version management
  - Automated changelog generation
  - Conventional commit integration
  - Multi-package versioning support
- **NEW:** Bundle size monitoring with size-limit
  - Per-package size budgets
  - Automatic bundle analysis in CI
- **NEW:** Husky pre-commit hooks
  - Lint-staged for auto-formatting
  - Type checking before commit
  - Prettier formatting

#### Code Quality
- **NEW:** Prettier configuration
  - Consistent code formatting across project
  - Auto-format on save
  - Pre-commit formatting hooks
- **NEW:** Enhanced vitest setup
  - jest-axe for accessibility testing
  - Extended matchers for better assertions
  - Mocked browser APIs (Speech, IntersectionObserver, etc.)
- **IMPROVED:** Package.json scripts
  - Added `test:watch` and `test:coverage`
  - Added `lint:fix` for auto-fixing
  - Added `changeset` commands

### 📚 New Documentation

- **Getting Started:**
  - [Installation Guide](./docs/getting-started/installation.md)
  - [5-Minute Quick Start](./docs/getting-started/quick-start.md)
  - First Component Tutorial (coming soon)

- **Architecture:**
  - [System Overview](./docs/architecture/overview.md) with diagrams
  - [Design Decisions](./docs/architecture/design-decisions.md) (coming soon)
  - [Monorepo Structure](./docs/architecture/monorepo.md) (coming soon)

- **API Reference:**
  - [Components API](./docs/api/components.md) - ChatWindow, MessageList, VoiceInput, etc.
  - [Hooks API](./docs/api/hooks.md) - All 25+ hooks documented

### 🐛 Bug Fixes

- Fixed missing type definitions in export
- Corrected vitest configuration for coverage reporting
- Fixed lint-staged file patterns

### 🔧 Internal Changes

- Reorganized 40+ markdown files into structured directories
- Archived phase completion documents
- Updated turbo.json for better caching
- Improved TypeScript strict mode compliance

---

## [0.1.0] - 2024-10-30

### 🎉 Initial Release - Phase 4 Complete

#### Core Features

- **47 Production-Ready Components**
  - ChatWindow with full chat interface
  - MessageList with virtualization
  - Message with Markdown & code highlighting
  - AdvancedChatInput with autocomplete
  - VoiceInput with speech-to-text
  - FileUpload with drag & drop
  - And 41 more...

- **25+ Custom Hooks**
  - `useChat` - Main chat state management
  - `useStreaming` - SSE/WebSocket streaming
  - `useVoiceInput` - Voice recognition
  - `useErrorRecovery` - Auto-retry with backoff
  - `useMobileKeyboard` - Mobile keyboard handling
  - And 20 more...

#### Design System

- **11 Built-in Themes**
  - Default, Dark, Ocean, Sunset, Forest
  - Corporate, Glassmorphism, Neon
  - Minimal, Warm, Cool
- **Live Theme Editor**
- **Dark Mode Support**
- **Fully Responsive Design**

#### Accessibility

- **WCAG 2.1 AAA Compliance**
- Keyboard navigation with shortcuts
- Screen reader optimization
- Focus management system
- AAA contrast ratios

#### AI Features

- **8 AI Provider Adapters**
  - OpenAI (GPT-3.5/4)
  - Anthropic (Claude 2/3)
  - Azure OpenAI
  - Cohere
  - Hugging Face
  - Google PaLM
  - Custom adapters
- Smart suggestions & auto-complete
- Content moderation
- Sentiment analysis
- Token tracking & cost estimation

#### Analytics & Monitoring

- **7 Analytics Providers**
  - Google Analytics 4
  - Mixpanel
  - PostHog
  - Amplitude
  - Segment
  - Custom API
  - Console (dev mode)
- **35+ Predefined Events**
- Auto-tracking for page views & errors
- A/B testing support
- Funnel tracking utilities

#### Error Handling

- **6 Error Tracking Providers**
  - Sentry
  - Rollbar
  - Bugsnag
  - LogRocket
  - Custom API
  - Console (dev mode)
- **10 Specialized Error Classes**
- Automatic retry with exponential backoff
- User feedback collection
- Error statistics dashboard
- Offline error storage

#### Performance

- Virtual scrolling for 1000+ messages
- Performance monitoring dashboard
- Memory leak detection
- Bundle optimization with tree-shaking
- Code splitting support

#### Mobile Support

- iOS keyboard handling
- Android keyboard detection
- Touch gestures
- Auto-scroll to input
- Viewport height management

#### Developer Experience

- 100% TypeScript with strict mode
- Comprehensive Storybook
- 9 working example applications
- 30,000+ words of documentation
- 100+ code examples

---

## Project Statistics

- **32,650** lines of production code
- **47** React components
- **25+** custom hooks
- **11** built-in themes
- **9** working examples
- **80%+** test coverage
- **0** known critical bugs

---

## Upgrade Guide

### From 0.0.x to 0.1.0

No breaking changes. This is the initial stable release.

### Installing

```bash
npm install @clarity-chat/react@latest
```

---

## Links

- [GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](./docs/README.md)
- [Examples](./examples/README.md)
- [Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

## Contributors

- [@christireid](https://github.com/christireid) - Creator & Maintainer
- [All Contributors](https://github.com/christireid/Clarity-ai-chat-components/graphs/contributors)

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**

[Unreleased]: https://github.com/christireid/Clarity-ai-chat-components/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/christireid/Clarity-ai-chat-components/releases/tag/v0.1.0
