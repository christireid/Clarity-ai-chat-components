#!/usr/bin/env tsx
/**
 * Export Verification Script
 *
 * This script verifies that all exports in the public API entry points are valid
 * and can be resolved. It catches issues like:
 * - Missing export paths
 * - Incorrect relative imports
 * - Circular dependencies
 * - Type-only exports that accidentally include runtime code
 *
 * Run with: pnpm exec tsx scripts/verify-exports.ts
 */
export {};
//# sourceMappingURL=verify-exports.d.ts.map