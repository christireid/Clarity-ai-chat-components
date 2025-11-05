/**
 * License tier types
 */
export type LicenseTier = 'free' | 'pro-individual' | 'pro-team' | 'enterprise';
/**
 * License status
 */
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled';
/**
 * License type (annual vs lifetime)
 */
export type LicenseType = 'annual' | 'lifetime';
/**
 * License key structure
 */
export interface LicenseKey {
    /** Unique license key string */
    key: string;
    /** License tier */
    tier: LicenseTier;
    /** License type */
    type: LicenseType;
    /** Customer email */
    email: string;
    /** Company name (optional) */
    company?: string;
    /** Number of developer seats */
    seats: number;
    /** Issue date */
    issuedAt: Date;
    /** Expiration date (null for lifetime) */
    expiresAt: Date | null;
    /** License status */
    status: LicenseStatus;
    /** Metadata */
    metadata?: Record<string, any>;
}
/**
 * License validation result
 */
export interface LicenseValidationResult {
    /** Is the license valid */
    valid: boolean;
    /** License details if valid */
    license?: LicenseKey;
    /** Error message if invalid */
    error?: string;
    /** Validation timestamp */
    validatedAt: Date;
    /** Days until expiration (null for lifetime or if invalid) */
    daysUntilExpiration?: number;
}
/**
 * License features by tier
 */
export interface LicenseFeatures {
    /** Components available */
    components: string[];
    /** Themes available */
    themes: string[];
    /** AI providers */
    aiProviders: string[];
    /** Analytics providers */
    analyticsProviders: string[];
    /** Error tracking providers */
    errorProviders: string[];
    /** Enterprise features */
    enterpriseFeatures: boolean;
    /** Support level */
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
    /** White-label allowed */
    whiteLabelAllowed: boolean;
    /** SaaS usage allowed */
    saasAllowed: boolean;
}
/**
 * License configuration
 */
export interface LicenseConfig {
    /** API endpoint for validation */
    validationEndpoint?: string;
    /** Local validation (offline) */
    enableOfflineValidation?: boolean;
    /** Cache duration in milliseconds */
    cacheDuration?: number;
    /** Development mode (skip validation) */
    devMode?: boolean;
}
//# sourceMappingURL=types.d.ts.map