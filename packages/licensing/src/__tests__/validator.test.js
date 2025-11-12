import { describe, it, expect } from 'vitest';
import { validateLicense, isLicenseExpired, getDaysUntilExpiration } from '../validator';
describe('License Validator', () => {
    describe('validateLicense', () => {
        it('should validate in dev mode', async () => {
            const result = await validateLicense('any-key', {
                devMode: true,
            });
            expect(result.valid).toBe(true);
            expect(result.license).toBeDefined();
            expect(result.license?.tier).toBe('enterprise');
            expect(result.license?.metadata?.devMode).toBe(true);
        });
        it('should validate valid key format', async () => {
            const result = await validateLicense('PRO-IND-ANN-ABC123DEF456GHI789', {
                enableOfflineValidation: true,
            });
            expect(result.valid).toBe(true);
            expect(result.license).toBeDefined();
        });
        it('should reject invalid key format', async () => {
            const result = await validateLicense('INVALID', {
                enableOfflineValidation: true,
            });
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
        });
        it('should reject empty key', async () => {
            const result = await validateLicense('', {
                enableOfflineValidation: true,
            });
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Invalid license key format');
        });
        it('should include validation timestamp', async () => {
            const before = new Date();
            const result = await validateLicense('PRO-IND-ANN-ABC123DEF456GHI789', {
                enableOfflineValidation: true,
            });
            const after = new Date();
            expect(result.validatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(result.validatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });
    });
    describe('isLicenseExpired', () => {
        it('should return false for lifetime licenses', () => {
            const license = {
                key: 'PRO-IND-LTD-ABC123',
                tier: 'pro-individual',
                type: 'lifetime',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date('2024-01-01'),
                expiresAt: null,
                status: 'active',
            };
            expect(isLicenseExpired(license)).toBe(false);
        });
        it('should return false for non-expired annual licenses', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const license = {
                key: 'PRO-IND-ANN-ABC123',
                tier: 'pro-individual',
                type: 'annual',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date(),
                expiresAt: futureDate,
                status: 'active',
            };
            expect(isLicenseExpired(license)).toBe(false);
        });
        it('should return true for expired annual licenses', () => {
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const license = {
                key: 'PRO-IND-ANN-ABC123',
                tier: 'pro-individual',
                type: 'annual',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date('2023-01-01'),
                expiresAt: pastDate,
                status: 'active',
            };
            expect(isLicenseExpired(license)).toBe(true);
        });
    });
    describe('getDaysUntilExpiration', () => {
        it('should return null for lifetime licenses', () => {
            const license = {
                key: 'PRO-IND-LTD-ABC123',
                tier: 'pro-individual',
                type: 'lifetime',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date(),
                expiresAt: null,
                status: 'active',
            };
            expect(getDaysUntilExpiration(license)).toBeNull();
        });
        it('should calculate days for annual licenses', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            const license = {
                key: 'PRO-IND-ANN-ABC123',
                tier: 'pro-individual',
                type: 'annual',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date(),
                expiresAt: futureDate,
                status: 'active',
            };
            const days = getDaysUntilExpiration(license);
            expect(days).toBeGreaterThanOrEqual(29);
            expect(days).toBeLessThanOrEqual(31);
        });
        it('should return negative days for expired licenses', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 30);
            const license = {
                key: 'PRO-IND-ANN-ABC123',
                tier: 'pro-individual',
                type: 'annual',
                email: 'test@example.com',
                seats: 1,
                issuedAt: new Date('2023-01-01'),
                expiresAt: pastDate,
                status: 'active',
            };
            const days = getDaysUntilExpiration(license);
            expect(days).toBeLessThan(0);
        });
    });
});
//# sourceMappingURL=validator.test.js.map