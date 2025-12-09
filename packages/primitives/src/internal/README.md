# Internal Utilities

> **Warning**: This directory contains internal implementation details. These APIs are **NOT part of
> the public API** and may change without notice.

## Purpose

This directory contains utilities that are:

- Used internally by the primitives library
- Not intended for direct consumer use
- Subject to breaking changes without major version bumps

## Adding New Utilities

When adding utilities to this directory:

1. Ensure it's truly internal (not needed by consumers)
2. Add comprehensive JSDoc documentation
3. Export from `index.ts`
4. Add tests if applicable
