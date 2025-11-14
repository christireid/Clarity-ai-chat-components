import type { LicenseTier, LicenseFeatures } from './types';
/**
 * Get features available for a license tier
 */
export declare function getLicenseFeatures(tier: LicenseTier): LicenseFeatures;
/**
 * Check if a feature is available for a tier
 */
export declare function hasFeature(tier: LicenseTier, feature: string): boolean;
/**
 * Check if a component is available for a tier
 */
export declare function isComponentAvailable(tier: LicenseTier, component: string): boolean;
/**
 * Check if a theme is available for a tier
 */
export declare function isThemeAvailable(tier: LicenseTier, theme: string): boolean;
/**
 * Check if an AI provider is available for a tier
 */
export declare function isAIProviderAvailable(tier: LicenseTier, provider: string): boolean;
/**
 * Get tier name for display
 */
export declare function getTierDisplayName(tier: LicenseTier): string;
/**
 * Get tier upgrade path
 */
export declare function getUpgradePath(currentTier: LicenseTier): LicenseTier | null;
/**
 * Calculate upgrade discount
 */
export declare function getUpgradeDiscount(currentTier: LicenseTier, targetTier: LicenseTier, remainingMonths: number): number;
//# sourceMappingURL=features.d.ts.map