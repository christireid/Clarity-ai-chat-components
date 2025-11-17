# Internal APIs

This directory contains **low-level primitives** that are:
- Framework-agnostic where possible
- Internal implementation details
- Not intended for direct use by most developers
- Power-user utilities and adapters

## Structure

- `adapters/` - Model adapters (OpenAI, Anthropic, etc.)
- `utils/` - Pure utility functions
- `types/` - Internal type definitions

## Usage

These APIs are exported for advanced use cases but are not the recommended entry point. Most developers should use:

- **Top-Level APIs**: `ClarityChat`, `useClarityChat`
- **Mid-Level APIs**: `ChatWindow`, `useChatEnhanced`

See `DESIGN.md` for architecture details.
