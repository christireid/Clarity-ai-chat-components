# Changelog

All notable changes to the Clarity Chat VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-11

### Highlights

**Clarity Chat 1.0** is our first public marketplace release! This version transforms the extension
from internal tooling into a premium, public-facing developer tool for building AI chat
applications.

### Added

- **GitHub Copilot Chat Participant**
  - Chat with `@clarity` directly in VS Code Copilot Chat
  - Slash commands: `/component`, `/hook`, `/memory`, `/optimize`, `/migrate`, `/docs`
  - Natural language queries for components, hooks, and patterns
  - Follow-up suggestions for deeper exploration

- **Visual Component Picker**
  - Browse components by category (Top-Level, Building Blocks, Streaming, Providers, Token
    Management, Utilities)
  - 18 components with full TypeScript support
  - Auto-import handling
  - Quick documentation access

- **Visual Hook Picker**
  - Browse hooks by category (Primary, Memory, Streaming, Token Optimization, UI State, Provider,
    Utilities)
  - 18 hooks with usage examples
  - Automatic import insertion

- **API Route Generator**
  - Generate streaming API routes for OpenAI, Anthropic, Google AI, or Multi-Provider
  - Framework support: Next.js App Router, Next.js Pages Router, Express, Hono
  - Streaming and non-streaming variants
  - Type-safe implementations

- **Migration Assistant**
  - Convert Vercel AI SDK code to Clarity Chat
  - Automatic pattern detection and conversion
  - Preview changes before applying
  - Import, hook, options, and type migration

- **External Resource Commands**
  - Open Documentation with topic picker
  - Open Storybook with component picker
  - Quick access to GitHub, Discord, examples

- **Expanded Snippet Library (50+ snippets)**
  - Component snippets: ClarityChat, ChatWindow, MessageList, ChatInput, StreamingMessage, and more
  - Hook snippets: useClarityChat, useMemoryContext, useTokenBudgetMonitor, and more
  - API route snippets: OpenAI, Anthropic, Google, Express, Hono
  - Import snippets: components, hooks, types
  - Complete page and hook setup templates

- **Enhanced IntelliSense**
  - Clarity Chat component completions with documentation
  - Hook completions with parameter hints
  - Export completions for import statements
  - useClarityChat options completions
  - Memory strategy completions

- **Context Menu Integration**
  - Right-click to add components or hooks
  - Right-click folders to create API routes

### Changed

- Minimum VS Code version updated to 1.90.0 (for Copilot Chat Participant API)
- Updated extension branding for marketplace
- Improved snippet organization with consistent `cc-` prefix
- Enhanced completion provider with Clarity Chat-specific items

### Improved

- README rewritten for marketplace presentation
- Documentation links updated to official docs site
- Better categorization of commands and features

---

## [0.1.0] - 2024-12-09

### Added

- **IntelliSense Support**
  - Auto-completion for AI model names (OpenAI, Anthropic, Google AI)
  - Environment variable suggestions for API keys
  - Context-aware parameter hints

- **Hover Documentation**
  - Model information with pricing, context windows, and capabilities
  - API key setup instructions
  - Links to official documentation

- **Code Snippets**
  - 60+ production-ready snippets for TypeScript, JavaScript, and React
  - OpenAI, Anthropic, and Google AI integrations
  - Next.js API routes with streaming support
  - React components and hooks for chat interfaces

- **CodeLens Hints**
  - API call detection with provider information
  - Quick links to documentation

- **Commands**
  - `Clarity Chat: Initialize Project` - Set up new projects
  - `Clarity Chat: Add Provider` - Add AI providers to existing projects
  - `Clarity Chat: Validate Configuration` - Check for common issues
  - `Clarity Chat: Show Examples` - Browse and insert code examples
  - `Clarity Chat: Component Preview` - Preview chat components
  - `Clarity Chat: Manage API Keys` - Manage provider API keys

- **Keyboard Shortcuts**
  - `Ctrl/Cmd+Shift+C I` - Initialize Project
  - `Ctrl/Cmd+Shift+C E` - Show Examples
  - `Ctrl/Cmd+Shift+C V` - Validate Config
  - `Ctrl/Cmd+Shift+C P` - Add Provider
  - `Ctrl/Cmd+Shift+C O` - Component Preview

- **Diagnostics**
  - Hardcoded API key detection
  - Missing error handling warnings
  - Configuration validation

- **Configuration Options**
  - `clarity-chat.enableIntelliSense` - Toggle IntelliSense
  - `clarity-chat.enableCodeLens` - Toggle CodeLens hints
  - `clarity-chat.defaultProvider` - Set default AI provider
  - `clarity-chat.showInlineHints` - Toggle inline parameter hints

### Security

- Warning system for hardcoded API keys in source code
- Secure API key management recommendations
