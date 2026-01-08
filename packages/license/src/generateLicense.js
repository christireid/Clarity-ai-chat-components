/**
 * License Key Generation
 *
 * This module is intended for SERVER-SIDE use only.
 * Do not import this in client-side code as it requires the secret key.
 *
 * @packageDocumentation
 */
import { base64Encode, simpleChecksum } from './utils';
/** Current license format version */
const LICENSE_VERSION = 1;
/** License key prefix */
const LICENSE_PREFIX = 'CC';
/**
 * Generate a Clarity Chat license key
 *
 * @param options - License configuration options
 * @param secretKey - Server secret for generating checksums
 * @returns Formatted license key string
 *
 * @example
 * ```typescript
 * const key = generateLicenseKey({
 *   orderNumber: 'CC-123456',
 *   licensee: 'Acme Corp',
 *   email: 'dev@acme.com',
 *   plan: 'pro',
 *   scope: 'team',
 *   durationDays: 365,
 * }, process.env.CLARITY_LICENSE_SECRET);
 *
 * // Returns: CC-1-eyJvcmRlck51bWJlci....-a1b2c3d4
 * ```
 */
export function generateLicenseKey(options, secretKey) {
    const { orderNumber, licensee, email, plan, scope, durationDays = 365, maxDevelopers, domains, } = options;
    // Validate required fields
    if (!orderNumber || !licensee || !email || !plan || !scope) {
        throw new Error('Missing required license fields');
    }
    if (!secretKey) {
        throw new Error('Secret key is required for license generation');
    }
    // Calculate timestamps
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + durationDays * 24 * 60 * 60;
    // Build payload
    const payload = {
        orderNumber,
        licensee,
        email,
        plan,
        scope,
        issuedAt: now,
        expiresAt,
        version: LICENSE_VERSION,
    };
    // Add optional fields
    if (maxDevelopers !== undefined) {
        payload.maxDevelopers = maxDevelopers;
    }
    if (domains && domains.length > 0) {
        payload.domains = domains;
    }
    // Encode payload to base64
    const encodedPayload = base64Encode(JSON.stringify(payload));
    // Generate checksum with secret
    const checksum = simpleChecksum(encodedPayload + secretKey);
    // Format: PREFIX-VERSION-PAYLOAD-CHECKSUM
    return `${LICENSE_PREFIX}-${LICENSE_VERSION}-${encodedPayload}-${checksum}`;
}
/**
 * Parse a license key into its components
 *
 * @param licenseKey - The license key to parse
 * @returns Parsed components or null if invalid format
 */
export function parseLicenseKey(licenseKey) {
    if (!licenseKey || typeof licenseKey !== 'string') {
        return null;
    }
    // Split by first occurrences of '-'
    const firstDash = licenseKey.indexOf('-');
    const secondDash = licenseKey.indexOf('-', firstDash + 1);
    const lastDash = licenseKey.lastIndexOf('-');
    if (firstDash === -1 || secondDash === -1 || lastDash === secondDash) {
        return null;
    }
    const prefix = licenseKey.substring(0, firstDash);
    const versionStr = licenseKey.substring(firstDash + 1, secondDash);
    const encodedPayload = licenseKey.substring(secondDash + 1, lastDash);
    const checksum = licenseKey.substring(lastDash + 1);
    const version = parseInt(versionStr, 10);
    if (isNaN(version)) {
        return null;
    }
    return {
        prefix,
        version,
        encodedPayload,
        checksum,
    };
}
/**
 * Verify a license key's checksum (server-side only)
 *
 * @param licenseKey - The license key to verify
 * @param secretKey - Server secret used during generation
 * @returns true if checksum is valid
 */
export function verifyLicenseChecksum(licenseKey, secretKey) {
    const parsed = parseLicenseKey(licenseKey);
    if (!parsed) {
        return false;
    }
    const expectedChecksum = simpleChecksum(parsed.encodedPayload + secretKey);
    return parsed.checksum === expectedChecksum;
}
/**
 * Generate a batch of license keys
 * Useful for generating multiple licenses at once
 *
 * @param licenses - Array of license options
 * @param secretKey - Server secret for checksums
 * @returns Array of generated license keys
 */
export function generateLicenseKeyBatch(licenses, secretKey) {
    return licenses.map((options) => generateLicenseKey(options, secretKey));
}
//# sourceMappingURL=generateLicense.js.map