import type { LicenseKey, LicenseValidationResult, LicenseConfig } from './types';
/**
 * Validate a license key
 */
export declare function validateLicense(key: string, config?: LicenseConfig): Promise<LicenseValidationResult>;
/**
 * Check if license is expired
 */
export declare function isLicenseExpired(license: LicenseKey): boolean;
/**
 * Get days until expiration
 */
export declare function getDaysUntilExpiration(license: LicenseKey): number | null;
/**
 * Verify license signature (for production use)
 * This would verify the license key was signed by your private key
 */
export declare function verifyLicenseSignature(key: string, signature: string, publicKey: string): Promise<boolean>;
//# sourceMappingURL=validator.d.ts.map