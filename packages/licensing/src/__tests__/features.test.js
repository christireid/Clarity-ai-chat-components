import { describe, it, expect } from 'vitest';
import { getLicenseFeatures, hasFeature, isComponentAvailable, isThemeAvailable, getTierDisplayName, getUpgradePath, getUpgradeDiscount, } from '../features';
describe('License Features', () => {
    describe('getLicenseFeatures', () => {
        it('should return free tier features', () => {
            const features = getLicenseFeatures('free');
            expect(features.components).toContain('Button');
            expect(features.components).toContain('ChatInput');
            expect(features.themes).toEqual(['default', 'dark', 'minimal']);
            expect(features.supportLevel).toBe('community');
            expect(features.enterpriseFeatures).toBe(false);
        });
        it('should return pro individual features', () => {
            const features = getLicenseFeatures('pro-individual');
            expect(features.components.length).toBeGreaterThan(50);
            expect(features.components).toContain('VoiceInput');
            expect(features.components).toContain('FileUpload');
            expect(features.themes).toContain('ocean');
            expect(features.aiProviders).toContain('openai');
            expect(features.supportLevel).toBe('email');
        });
        it('should return pro team features', () => {
            const features = getLicenseFeatures('pro-team');
            expect(features.components.length).toBeGreaterThan(50);
            expect(features.supportLevel).toBe('priority');
        });
        it('should return enterprise features', () => {
            const features = getLicenseFeatures('enterprise');
            expect(features.components.length).toBeGreaterThan(60);
            expect(features.components).toContain('SSOConfigWizard');
            expect(features.enterpriseFeatures).toBe(true);
            expect(features.supportLevel).toBe('dedicated');
            expect(features.whiteLabelAllowed).toBe(true);
            expect(features.saasAllowed).toBe(true);
        });
    });
    describe('hasFeature', () => {
        it('should check component availability', () => {
            expect(hasFeature('free', 'Button')).toBe(true);
            expect(hasFeature('free', 'VoiceInput')).toBe(false);
            expect(hasFeature('pro-individual', 'VoiceInput')).toBe(true);
        });
        it('should check theme availability', () => {
            expect(hasFeature('free', 'dark')).toBe(true);
            expect(hasFeature('free', 'ocean')).toBe(false);
            expect(hasFeature('pro-individual', 'ocean')).toBe(true);
        });
        it('should check enterprise features', () => {
            expect(hasFeature('free', 'enterprise')).toBe(false);
            expect(hasFeature('pro-individual', 'enterprise')).toBe(false);
            expect(hasFeature('enterprise', 'enterprise')).toBe(true);
        });
        it('should check white-label feature', () => {
            expect(hasFeature('free', 'white-label')).toBe(false);
            expect(hasFeature('pro-team', 'white-label')).toBe(false);
            expect(hasFeature('enterprise', 'white-label')).toBe(true);
        });
    });
    describe('isComponentAvailable', () => {
        it('should check free tier components', () => {
            expect(isComponentAvailable('free', 'Button')).toBe(true);
            expect(isComponentAvailable('free', 'ChatWindow')).toBe(true);
            expect(isComponentAvailable('free', 'VoiceInput')).toBe(false);
        });
        it('should check pro tier components', () => {
            expect(isComponentAvailable('pro-individual', 'VoiceInput')).toBe(true);
            expect(isComponentAvailable('pro-individual', 'FileUpload')).toBe(true);
            expect(isComponentAvailable('pro-individual', 'SSOConfigWizard')).toBe(false);
        });
        it('should check enterprise components', () => {
            expect(isComponentAvailable('enterprise', 'SSOConfigWizard')).toBe(true);
            expect(isComponentAvailable('enterprise', 'AuthTenantDashboard')).toBe(true);
        });
    });
    describe('isThemeAvailable', () => {
        it('should check free tier themes', () => {
            expect(isThemeAvailable('free', 'default')).toBe(true);
            expect(isThemeAvailable('free', 'dark')).toBe(true);
            expect(isThemeAvailable('free', 'ocean')).toBe(false);
        });
        it('should check pro tier themes', () => {
            expect(isThemeAvailable('pro-individual', 'ocean')).toBe(true);
            expect(isThemeAvailable('pro-individual', 'glassmorphism')).toBe(true);
        });
    });
    describe('getTierDisplayName', () => {
        it('should return display names', () => {
            expect(getTierDisplayName('free')).toBe('Free Tier');
            expect(getTierDisplayName('pro-individual')).toBe('Pro Individual');
            expect(getTierDisplayName('pro-team')).toBe('Pro Team');
            expect(getTierDisplayName('enterprise')).toBe('Enterprise');
        });
    });
    describe('getUpgradePath', () => {
        it('should return next tier', () => {
            expect(getUpgradePath('free')).toBe('pro-individual');
            expect(getUpgradePath('pro-individual')).toBe('pro-team');
            expect(getUpgradePath('pro-team')).toBe('enterprise');
            expect(getUpgradePath('enterprise')).toBeNull();
        });
    });
    describe('getUpgradeDiscount', () => {
        it('should calculate upgrade discount', () => {
            // Pro Individual ($149) to Pro Team ($499) with 6 months remaining
            const discount = getUpgradeDiscount('pro-individual', 'pro-team', 6);
            expect(discount).toBeGreaterThan(0);
            expect(discount).toBeLessThanOrEqual(350); // Max discount is price difference
        });
        it('should return 0 for same tier', () => {
            const discount = getUpgradeDiscount('pro-individual', 'pro-individual', 6);
            expect(discount).toBe(0);
        });
        it('should return 0 for downgrade', () => {
            const discount = getUpgradeDiscount('pro-team', 'pro-individual', 6);
            expect(discount).toBe(0);
        });
        it('should return 0 for no remaining months', () => {
            const discount = getUpgradeDiscount('pro-individual', 'pro-team', 0);
            expect(discount).toBe(0);
        });
    });
});
//# sourceMappingURL=features.test.js.map