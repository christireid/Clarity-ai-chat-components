# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete documentation restructure with organized hierarchy
- Comprehensive CI/CD pipeline with GitHub Actions
- Automated testing with coverage reporting
- Release automation with Changesets
- Bundle size monitoring with size-limit
- Pre-commit hooks with Husky and lint-staged
- Prettier configuration for consistent formatting
- New API reference documentation for all components and hooks
- Architecture overview with Mermaid diagrams
- Quick start guide and installation instructions
- Contributing guidelines and development setup docs

### Changed
- Reorganized root directory structure
- Moved phase documentation to `.archive/phases`
- Updated main README with modern design and clear navigation
- Improved package.json with new scripts and metadata
- Enhanced GitHub Actions workflows for better CI/CD

### Fixed
- Documentation discoverability issues
- Inconsistent code formatting
- Missing developer tooling configuration

## [0.1.0] - 2024-10-30

### Added - Phase 4 Complete
- Voice input component with Web Speech API support
- Mobile keyboard handling for iOS and Android
- Glassmorphism theme with modern glass effects
- Pre-built templates (Support Bot, Code Assistant)
- Context visualizer component
- Conversation list with search and filtering

### Added - Phase 3 Complete
- Advanced theme system with 11 built-in themes
- Live theme editor and preview components
- WCAG 2.1 AAA accessibility compliance
- Keyboard shortcuts system with help modal
- Analytics integration (7 providers)
- Performance monitoring dashboard
- Error tracking system (6 providers)
- User feedback collection
- AI features (suggestions, moderation, sentiment)
- Content moderation and PII detection

### Added - Phase 2 Complete
- Performance optimization with virtualization
- Error boundaries and recovery strategies
- Network status monitoring
- Token tracking and cost estimation
- Optimistic updates
- Empty states and skeleton loaders
- Icon system with 20+ icons
- Advanced input features

### Added - Phase 1 Complete
- Core chat components (Message, MessageList, ChatInput, ChatWindow)
- Streaming support (SSE, WebSocket)
- File upload and preview
- Message operations (edit, delete, retry)
- Context management
- Toast notifications
- Progress indicators
- Advanced animations with Framer Motion

### Technical
- Monorepo structure with Turborepo
- TypeScript 5.3+ with strict mode
- React 18+ support
- Comprehensive test suite with Vitest
- Storybook for component documentation
- VitePress documentation site
- 9 working example applications

## [0.0.1] - 2024-09-01

### Added
- Initial project setup
- Basic component structure
- Type definitions
- Development tooling

---

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### Creating a Changeset

```bash
npm run changeset
```

### Publishing a Release

```bash
npm run version-packages  # Updates versions and CHANGELOG
npm run release          # Builds and publishes to npm
```

---

## Version History

- **v0.1.0** - Phase 4 completion with voice input, mobile optimization, and templates
- **v0.0.1** - Initial release with core functionality

---

**For detailed information about each release, see the [Releases page](https://github.com/christireid/Clarity-ai-chat-components/releases).**
