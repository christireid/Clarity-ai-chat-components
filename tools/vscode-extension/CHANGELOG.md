# Changelog

All notable changes to the Clarity Chat VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
