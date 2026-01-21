# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Provider-Native KV Caching** - 90% cost reduction using Anthropic, OpenAI, and Google Gemini caching APIs
  - `quickCache()` - Zero-config caching with automatic provider selection
  - `anthropicCache()`, `openaiCache()`, `googleCache()` - Provider-specific functions
  - `createProviderCache()` - Factory with custom configuration
  - `estimateCacheSavings()` - Preview savings before applying
  - Full test coverage (39 tests) with comprehensive provider verification
- **KV Caching Verification** - Documented compliance with all three provider specs
- **Simple Caching API Tests** - 22 new tests for user-facing caching functions
- Documentation for "simple" files purpose (internal testing utilities)
- Documentation for cache vs caching directory distinction
- Migration guide (MIGRATION.md) for deprecated APIs

### Changed
- ⚠️ **BREAKING**: Removed `DynamicCompressionEngine` from public API (use `LLMLinguaCompressor` instead)
- ⚠️ **BREAKING**: Removed `BasicCompressionEngine` class export (use `normalizeWhitespace()` function)
- Clarified bundle size in README (~400KB vs previously claimed ~200KB)
- Fixed 7 'any' types to proper TypeScript types for better type safety:
  - `ProviderCachingResult.messages` now properly typed
  - All production deployment configs properly typed
  - `ContentAnalysis` interface created for compression engine
- Console statements verified as documentation only (not production code)

### Fixed
- TypeScript strict mode now compiles with zero errors
- Provider caching types properly aligned across factory and types
- All test suites passing (39 provider caching tests + existing tests)

### Deprecated
- None (deprecated exports have been removed as of this version)

### Removed
- `DynamicCompressionEngine` - Achieved only 10-30% whitespace normalization vs claimed 70-85% compression
- `BasicCompressionEngine` class - Users should use `normalizeWhitespace()` function instead
- See [MIGRATION.md](./MIGRATION.md) for migration path

## [1.0.0] - 2026-01-20

### Added
- Initial release of @clarity-chat/token-optimization
- Token counting with gpt-tokenizer (20x smaller than tiktoken WASM)
- Text chunking with llm-splitter (100x smaller than LangChain)
- Compression strategies (LLMLingua, Extractive, Adaptive)
- Multi-tier caching (Exact, Smart, Tiered, Semantic)
- Model routing with complexity analysis
- TOON format (Token-Oriented Object Notation) for 40-60% savings
- Security features (OWASP LLM Top 10 compliance)
- Accessibility (WCAG 2.1 AA compliant components)
- Production features (health checks, observability, circuit breakers)
- React hooks for easy integration
- Zero-config usage with sensible defaults
- Full TypeScript support with exported types

### Migration Notes

#### From @clarity-chat/memory
If you're migrating from the old `@clarity-chat/memory` package:

1. Update imports:
```typescript
// Old
import { TokenCounter } from '@clarity-chat/memory'

// New
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
```

2. API changes:
- `TokenCounter` → `AccurateTokenCounter` or `SimpleTokenCounter`
- `MemoryCompressor` → `LLMLinguaCompressor` or `AdaptiveCompressor`
- See [MIGRATION.md](./MIGRATION.md) for complete migration guide

#### From @clarity-chat/react token utilities
Token optimization features have been extracted into this dedicated package:

```typescript
// Old
import { useTokenCount } from '@clarity-chat/react'

// New
import { useTokenCount } from '@clarity-chat/token-optimization'
```

## Version History

- **v1.0.0** (2026-01-20): Initial release with comprehensive token optimization features
- **Unreleased**: Provider-native KV caching, type safety improvements, deprecated API removal

---

## How to Update

### To latest unreleased version:
```bash
npm install @clarity-chat/token-optimization@latest
```

### Breaking Changes Checklist

If you're updating to unreleased version from v1.0.0:

- [ ] Replace `DynamicCompressionEngine` with `LLMLinguaCompressor` (see MIGRATION.md)
- [ ] Replace `BasicCompressionEngine` class with `normalizeWhitespace()` function
- [ ] Update any code using `messages: any[]` to handle proper types
- [ ] Test provider caching if you're using it

### No Breaking Changes If:
- ✅ You never used `DynamicCompressionEngine` or `BasicCompressionEngine`
- ✅ You're using the recommended APIs (`quickCache`, `anthropicCache`, etc.)
- ✅ You're using TypeScript (types will guide you)

---

**Need Help?** Check the [examples](./examples) directory or see [MIGRATION.md](./MIGRATION.md) for detailed migration paths.
