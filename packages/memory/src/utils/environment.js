/**
 * Environment Detection Utilities
 *
 * Auto-detect runtime environment and provide helpful defaults
 */
/**
 * Detect the current runtime environment
 */
export function detectEnvironment() {
    // Check for browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return 'browser';
    }
    // Check for Node.js
    if (typeof process !== 'undefined' && process.versions?.node) {
        // Check for serverless environments
        if (process.env.VERCEL ||
            process.env.AWS_LAMBDA_FUNCTION_NAME ||
            process.env.CLOUDFLARE_WORKERS ||
            process.env.NETLIFY) {
            return 'serverless';
        }
        return 'node';
    }
    return 'unknown';
}
/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable() {
    if (typeof window === 'undefined')
        return false;
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    }
    catch {
        return false;
    }
}
/**
 * Check if fetch is available
 */
export function isFetchAvailable() {
    return typeof fetch !== 'undefined';
}
/**
 * Get recommended storage type for environment
 */
export function getRecommendedStorageType() {
    const env = detectEnvironment();
    switch (env) {
        case 'browser':
            return isIndexedDBAvailable() ? 'indexeddb' : 'in-memory';
        case 'serverless':
            return 'in-memory'; // Serverless functions are stateless
        case 'node':
            return 'in-memory'; // Default, user should configure for production
        default:
            return 'in-memory';
    }
}
/**
 * Get environment-specific recommendations
 */
export function getEnvironmentRecommendations() {
    const env = detectEnvironment();
    const recommendations = {
        storage: getRecommendedStorageType(),
        embedding: 'none',
        warnings: [],
    };
    // Storage recommendations
    if (env === 'browser' && !isIndexedDBAvailable()) {
        recommendations.warnings.push('IndexedDB is not available. Using in-memory storage. Data will be lost on page refresh.');
    }
    if (env === 'serverless') {
        recommendations.warnings.push('Serverless environment detected. Consider using Redis or external storage for persistence.');
    }
    // Embedding recommendations
    if (!isFetchAvailable()) {
        recommendations.warnings.push('Fetch API not available. Embedding providers requiring network access will not work.');
    }
    return recommendations;
}
//# sourceMappingURL=environment.js.map