import type { LicenseKey, LicenseTier, LicenseType } from './types';
/**
 * Generate a license key
 */
export declare function generateLicenseKey(options: {
    tier: LicenseTier;
    type: LicenseType;
    email: string;
    company?: string;
    seats?: number;
    expirationMonths?: number;
}): LicenseKey;
/**
 * Parse license key to extract tier and type
 */
export declare function parseLicenseKey(key: string): {
    tier: LicenseTier | null;
    type: LicenseType | null;
    valid: boolean;
};
//# sourceMappingURL=generator.d.ts.map