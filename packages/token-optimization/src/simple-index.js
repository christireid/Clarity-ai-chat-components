/**
 * Token Optimization System - Simplified Version
 *
 * Basic implementation for testing without external dependencies
 */
// Core exports
export { SimpleTokenCounter as AccurateTokenCounter } from './tokenizers/simple-counter';
export { SimpleSecurityManager as TokenSecurityManager } from './security/simple-security';
export { SimpleToonOptimizer as ToonOptimizer } from './formats/simple-toon';
export { SimpleUnifiedOptimizer as UnifiedTokenOptimizer } from './simple-unified';
// Constants
export const DEFAULT_TOKENIZER_CONFIG = {
    model: 'gpt-4',
    cacheSize: 10000,
    enableCaching: true,
    enableMonitoring: true
};
export const DEFAULT_SECURITY_CONFIG = {
    enableSanitization: true,
    enableCompressionObfuscation: true,
    enableAuditLogging: true,
    enablePIIRedaction: true,
    noiseLevel: 0.1,
    complianceLevel: 'enterprise',
    auditRetention: 30
};
export const DEFAULT_TOON_CONFIG = {
    enableArrayTables: true,
    maxArraySizeForTable: 1000,
    preserveKeys: false,
    compactNumbers: true,
    quoteStrings: false
};
//# sourceMappingURL=simple-index.js.map