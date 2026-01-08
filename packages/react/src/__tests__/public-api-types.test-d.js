/**
 * Public API Type Safety Tests
 *
 * These tests verify that the public API exports have stable, correct types.
 * Run as part of the project's type check with: pnpm typecheck
 */
const _messageChecks = [
    true,
    true,
    true,
];
const _pluginChecks = [true, true];
const _toolChecks = [
    true,
    true,
    true,
];
const _vectorProviderChecks = [true, true, true, true];
// ============================================================================
// Export to prevent tree-shaking
// ============================================================================
export const typeAssertions = {
    _messageChecks,
    _pluginChecks,
    _toolChecks,
    _vectorProviderChecks,
};
//# sourceMappingURL=public-api-types.test-d.js.map