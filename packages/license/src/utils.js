/**
 * Base64 encoding utilities for license keys
 * Works in both Node.js and browser environments
 */
/**
 * Encode a string to URL-safe base64
 */
export function base64Encode(str) {
    // Check if we're in Node.js or browser
    if (typeof Buffer !== 'undefined') {
        // Node.js
        return Buffer.from(str, 'utf-8')
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    else if (typeof btoa !== 'undefined') {
        // Browser
        return btoa(unescape(encodeURIComponent(str)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    throw new Error('No base64 encoding available');
}
/**
 * Decode a URL-safe base64 string
 */
export function base64Decode(str) {
    // Restore standard base64 characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padding = base64.length % 4;
    if (padding) {
        base64 += '='.repeat(4 - padding);
    }
    // Check if we're in Node.js or browser
    if (typeof Buffer !== 'undefined') {
        // Node.js
        return Buffer.from(base64, 'base64').toString('utf-8');
    }
    else if (typeof atob !== 'undefined') {
        // Browser
        return decodeURIComponent(escape(atob(base64)));
    }
    throw new Error('No base64 decoding available');
}
/**
 * Generate a simple checksum for integrity verification
 * Note: This is NOT cryptographic - it's just for basic integrity
 */
export function simpleChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8).padStart(8, '0');
}
//# sourceMappingURL=utils.js.map