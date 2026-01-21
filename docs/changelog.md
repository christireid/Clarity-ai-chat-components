# Changelog

All notable changes to Clarity Chat will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Complete API reference documentation for all 95 hooks
- Complete API reference documentation for all 183 components
- "Choosing the Right Hook" decision guide
- Comprehensive troubleshooting guide
- FAQ with 50+ common questions
- Migration guide from Vercel AI SDK

### Changed
- Documentation structure completely overhauled
- Quick start guide improved with more examples
- All guides now include working code examples

### Fixed
- Documentation links now all resolve correctly
- Examples now properly tested
- TypeScript types improved across all hooks

---

## [2.0.0] - 2024-01-15

### Added
- `useClarityChat` - New main chat hook
- `useClarityChatWithTools` - Tool calling support
- `useClarityObject` - Structured output generation
- Token optimization system with semantic caching
- Memory management with episodic/semantic memory
- 180+ pre-built components
- 95+ composable hooks

### Changed
- Complete rewrite for better performance
- Improved TypeScript support
- Better error handling with circuit breakers
- Streaming architecture redesigned

### Deprecated
- `useChat` (old) - Use `useClarityChat` instead
- `useCompletion` - Use `useClarityChat` instead

### Removed
- Legacy v1 APIs (see migration guide)

---

## [1.5.0] - 2023-12-01

### Added
- WebSocket streaming support
- Rate limiting hooks
- Performance monitoring
- Battery-aware optimizations

---

## [1.0.0] - 2023-10-01

### Added
- Initial stable release
- Basic chat functionality
- SSE streaming
- OpenAI adapter
- Anthropic adapter

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 2.0.0 | 2024-01-15 | Complete rewrite, token optimization, memory |
| 1.5.0 | 2023-12-01 | WebSocket, performance improvements |
| 1.0.0 | 2023-10-01 | Initial stable release |

---

## Upgrade Guides

- [1.x → 2.x Migration Guide](./migration.md)
- [Vercel AI SDK → Clarity Chat](./migration.md#migrating-from-vercel-ai-sdk)

---

## Breaking Changes

### 2.0.0

**useChat Hook**
- Old `useChat` renamed to `useChatLegacy`
- New `useClarityChat` is the recommended hook
- See [migration guide](./migration.md#from-usechat-to-useclaritychat)

**Message Format**
- Added optional `metadata` field
- `id` is now optional (auto-generated if not provided)
- `createdAt` added for better timestamping

**API Changes**
- Removed `handleInputChange` and `handleSubmit` from hook return
- Input state now managed separately (more flexible)
- See [migration guide](./migration.md) for examples

---

## Deprecation Schedule

| Feature | Deprecated | Removal | Alternative |
|---------|------------|---------|-------------|
| `useChat` (old) | 2.0.0 | 3.0.0 | `useClarityChat` |
| `useCompletion` | 2.0.0 | 3.0.0 | `useClarityChat` |

---

## Roadmap

### Planned Features

**3.0.0 (Q2 2024)**
- [ ] React Native support
- [ ] Voice input/output
- [ ] Video chat integration
- [ ] Multi-modal support (images, files)
- [ ] Advanced RAG pipelines
- [ ] Custom model training integration

**Future**
- [ ] Collaborative editing
- [ ] Real-time multiplayer chat
- [ ] Voice cloning integration
- [ ] Advanced analytics dashboard

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to contribute to Clarity Chat.

---

## Support

- [Documentation](./README.md)
- [Discord](https://discord.gg/clarity-chat)
- [GitHub Issues](https://github.com/clarity-chat/clarity/issues)
