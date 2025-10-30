# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete documentation restructure with `/docs` directory
- Comprehensive architecture documentation with Mermaid diagrams
- CI/CD pipeline with GitHub Actions (test, build, release)
- Changesets integration for version management
- Size-limit configuration for bundle size monitoring
- Husky pre-commit hooks for code quality
- lint-staged for automatic code formatting
- Comprehensive test utilities in `test-utils/`
- New README with badges and feature highlights

### Changed
- Moved phase documentation to `.archive/phases/`
- Updated root README to be concise and user-friendly
- Improved project structure documentation

### Fixed
- Package.json scripts for better DX
- Test coverage reporting setup

## [0.1.0] - 2024-10-30

### Added
- Initial release with Phase 1-4 complete
- 47+ production-ready React components
- 25+ custom hooks
- 11 built-in themes including Glassmorphism
- Voice input with Web Speech API
- Mobile keyboard handling for iOS/Android
- Analytics integration (7 providers)
- Error tracking (6 providers)
- Accessibility features (WCAG 2.1 AAA)
- Pre-built templates (SupportBot, CodeAssistant)
- Streaming support (SSE, WebSocket)
- Performance optimization with virtualization
- 9 working example applications
- Comprehensive TypeScript support
- 80%+ test coverage

### Components
- ChatWindow - Main chat interface
- MessageList - Message rendering with virtualization
- Message - Rich message display
- ChatInput / AdvancedChatInput - Message composition
- VoiceInput - Speech-to-text input
- FileUpload - Drag & drop file handling
- ThinkingIndicator - AI processing states
- ContextManager - Document context handling
- ProjectSidebar - Conversation organization
- PromptLibrary - Template management
- ThemeSelector - Theme switcher UI
- PerformanceDashboard - Real-time metrics
- And 35+ more...

### Hooks
- useChat - Main chat state management
- useStreaming - Real-time streaming
- useVoiceInput - Speech recognition
- useMobileKeyboard - Mobile keyboard detection
- useErrorRecovery - Automatic retry logic
- useTokenTracker - Token counting & costs
- useAnalytics - Event tracking
- useKeyboardShortcuts - Keyboard navigation
- useMessageOperations - Edit, regenerate, branch
- And 16+ more...

### Packages
- @clarity-chat/react - Main component library
- @clarity-chat/types - TypeScript definitions
- @clarity-chat/primitives - Base UI components
- @clarity-chat/error-handling - Error recovery system
- @clarity-chat/dev-tools - Developer utilities
- @clarity-chat/cli - Command-line tools

---

## Version Format

We use [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible new features
- **PATCH** version for backwards-compatible bug fixes

## Release Types

### 🚀 Major Release (X.0.0)
Breaking changes, API redesigns, removed features

### ✨ Minor Release (0.X.0)
New features, new components, backwards-compatible changes

### 🐛 Patch Release (0.0.X)
Bug fixes, performance improvements, documentation updates

---

## Links
- [GitHub Releases](https://github.com/christireid/Clarity-ai-chat-components/releases)
- [npm Package](https://www.npmjs.com/package/@clarity-chat/react)
- [Documentation](./docs/README.md)
- [Contributing Guide](./docs/architecture/contributing.md)

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
