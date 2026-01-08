import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * License System Integration Tests
 *
 * Tests the full license lifecycle: generate → verify → gate → watermark
 * across package boundaries.
 */
import * as React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { LicenseInfo } from '../LicenseInfo';
import { generateLicenseKey, parseLicenseKey } from '../generateLicense';
import { verifyLicense, isLicenseValid } from '../verifyLicense';
import { LicenseGate } from '../withLicense';
import { withLicense, createLicenseWrapper } from '../withLicense';
import { WatermarkOverlay } from '../Watermark';
import { LicenseProvider, useLicenseContext } from '../LicenseProvider';
import { useLicenseStatus, useIsLicensed, useHasPlan, useLicenseWarning, } from '../hooks';
import { clearWarnings, isPlanSufficient } from '../constants';
const TEST_SECRET = 'integration-test-secret-key';
describe('License System Integration', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        clearWarnings();
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('Full Lifecycle: Generate → Verify → Gate → Clear', () => {
        it('should complete full license lifecycle', async () => {
            // 1. Generate a license key
            const licenseKey = generateLicenseKey({
                orderNumber: 'CC-INT-001',
                licensee: 'Integration Test Corp',
                email: 'test@integration.com',
                plan: 'pro',
                scope: 'team',
                durationDays: 365,
                maxDevelopers: 10,
            }, TEST_SECRET);
            expect(licenseKey).toMatch(/^CC-1-.+-[a-z0-9]+$/);
            // 2. Parse and verify the key
            const parsed = parseLicenseKey(licenseKey);
            expect(parsed).not.toBeNull();
            expect(parsed?.version).toBe(1);
            const verification = verifyLicense(licenseKey);
            expect(verification.status).toBe('Valid');
            expect(verification.payload?.licensee).toBe('Integration Test Corp');
            expect(verification.payload?.plan).toBe('pro');
            expect(verification.payload?.maxDevelopers).toBe(10);
            // 3. Set the license and verify components work
            LicenseInfo.setLicenseKey(licenseKey);
            expect(LicenseInfo.isValid()).toBe(true);
            expect(LicenseInfo.getLicensee()).toBe('Integration Test Corp');
            // 4. Render gated component
            const { rerender } = render(_jsx(LicenseGate, { requiredPlan: "pro", children: _jsx("div", { "data-testid": "pro-content", children: "Pro Feature Unlocked!" }) }));
            await waitFor(() => {
                expect(screen.getByTestId('pro-content')).toBeInTheDocument();
            });
            // 5. Clear the license and verify gate blocks
            act(() => {
                LicenseInfo.clearLicenseKey();
            });
            rerender(_jsx(LicenseGate, { requiredPlan: "pro", fallback: _jsx("div", { "data-testid": "fallback", children: "Please upgrade" }), children: _jsx("div", { "data-testid": "pro-content", children: "Pro Feature Unlocked!" }) }));
            await waitFor(() => {
                expect(screen.queryByTestId('pro-content')).not.toBeInTheDocument();
                expect(screen.getByTestId('fallback')).toBeInTheDocument();
            });
        });
        it('should handle plan hierarchy correctly', () => {
            // Test plan sufficiency
            expect(isPlanSufficient('enterprise', 'community')).toBe(true);
            expect(isPlanSufficient('enterprise', 'pro')).toBe(true);
            expect(isPlanSufficient('enterprise', 'enterprise')).toBe(true);
            expect(isPlanSufficient('pro', 'community')).toBe(true);
            expect(isPlanSufficient('pro', 'pro')).toBe(true);
            expect(isPlanSufficient('pro', 'enterprise')).toBe(false);
            expect(isPlanSufficient('community', 'community')).toBe(true);
            expect(isPlanSufficient('community', 'pro')).toBe(false);
            expect(isPlanSufficient('community', 'enterprise')).toBe(false);
        });
    });
    describe('Cross-Component Communication', () => {
        it('should sync license state across LicenseInfo and LicenseProvider', async () => {
            const licenseKey = generateLicenseKey({
                orderNumber: 'CC-SYNC-001',
                licensee: 'Sync Test',
                email: 'sync@test.com',
                plan: 'enterprise',
                scope: 'organization',
                durationDays: 365,
            }, TEST_SECRET);
            // Consumer component using context
            function ContextConsumer() {
                const { isValid, licensee, plan, hasPlan } = useLicenseContext();
                return (_jsxs("div", { children: [_jsx("span", { "data-testid": "ctx-valid", children: isValid ? 'yes' : 'no' }), _jsx("span", { "data-testid": "ctx-licensee", children: licensee ?? 'none' }), _jsx("span", { "data-testid": "ctx-plan", children: plan ?? 'none' }), _jsx("span", { "data-testid": "ctx-has-pro", children: hasPlan('pro') ? 'yes' : 'no' })] }));
            }
            // Consumer component using hooks
            function HookConsumer() {
                const status = useLicenseStatus();
                const isLicensed = useIsLicensed();
                const hasPro = useHasPlan('pro');
                return (_jsxs("div", { children: [_jsx("span", { "data-testid": "hook-status", children: status.status }), _jsx("span", { "data-testid": "hook-licensed", children: isLicensed ? 'yes' : 'no' }), _jsx("span", { "data-testid": "hook-has-pro", children: hasPro ? 'yes' : 'no' })] }));
            }
            // First, set via LicenseInfo
            LicenseInfo.setLicenseKey(licenseKey);
            // Render with both patterns
            render(_jsxs(_Fragment, { children: [_jsx(LicenseProvider, { licenseKey: licenseKey, children: _jsx(ContextConsumer, {}) }), _jsx(HookConsumer, {})] }));
            // Both should show valid
            expect(screen.getByTestId('ctx-valid')).toHaveTextContent('yes');
            expect(screen.getByTestId('ctx-licensee')).toHaveTextContent('Sync Test');
            expect(screen.getByTestId('ctx-plan')).toHaveTextContent('enterprise');
            expect(screen.getByTestId('ctx-has-pro')).toHaveTextContent('yes');
            expect(screen.getByTestId('hook-status')).toHaveTextContent('Valid');
            expect(screen.getByTestId('hook-licensed')).toHaveTextContent('yes');
            expect(screen.getByTestId('hook-has-pro')).toHaveTextContent('yes');
        });
    });
    describe('Watermark Integration', () => {
        it('should show watermark for unlicensed components', () => {
            function TestComponent() {
                return _jsx("div", { "data-testid": "content", children: "Test Content" });
            }
            const LicensedTestComponent = withLicense(TestComponent, {
                componentName: 'TestComponent',
                requiredPlan: 'pro',
                showWatermark: true,
                showConsoleWarning: false,
            });
            render(_jsx(LicensedTestComponent, {}));
            // Content should render
            expect(screen.getByTestId('content')).toBeInTheDocument();
            // Watermark should appear
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('should hide watermark for properly licensed components', () => {
            const licenseKey = generateLicenseKey({
                orderNumber: 'CC-WM-001',
                licensee: 'Watermark Test',
                email: 'wm@test.com',
                plan: 'pro',
                scope: 'individual',
                durationDays: 365,
            }, TEST_SECRET);
            LicenseInfo.setLicenseKey(licenseKey);
            function TestComponent() {
                return _jsx("div", { "data-testid": "content", children: "Test Content" });
            }
            const LicensedTestComponent = withLicense(TestComponent, {
                componentName: 'TestComponent',
                requiredPlan: 'pro',
                showWatermark: true,
                showConsoleWarning: false,
            });
            render(_jsx(LicensedTestComponent, {}));
            // Content should render
            expect(screen.getByTestId('content')).toBeInTheDocument();
            // Watermark should NOT appear
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });
    describe('Warning Deduplication', () => {
        it('should only warn once per feature across multiple renders', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            function TestFeature() {
                useLicenseWarning('SharedFeature', 'pro');
                return _jsx("div", { children: "Feature" });
            }
            // First render
            const { rerender, unmount } = render(_jsx(TestFeature, {}));
            expect(console.warn).toHaveBeenCalledTimes(1);
            // Re-render same component
            rerender(_jsx(TestFeature, {}));
            expect(console.warn).toHaveBeenCalledTimes(1);
            // Unmount and remount
            unmount();
            render(_jsx(TestFeature, {}));
            // Should still be 1 due to shared warning tracker
            expect(console.warn).toHaveBeenCalledTimes(1);
            process.env.NODE_ENV = originalEnv;
        });
        it('should warn separately for different features', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            function FeatureA() {
                useLicenseWarning('FeatureA', 'pro');
                return _jsx("div", { children: "A" });
            }
            function FeatureB() {
                useLicenseWarning('FeatureB', 'pro');
                return _jsx("div", { children: "B" });
            }
            render(_jsxs(_Fragment, { children: [_jsx(FeatureA, {}), _jsx(FeatureB, {})] }));
            // Should warn for each unique feature
            expect(console.warn).toHaveBeenCalledTimes(2);
            process.env.NODE_ENV = originalEnv;
        });
    });
    describe('createLicenseWrapper Factory', () => {
        it('should create consistent wrappers', () => {
            const createProComponent = createLicenseWrapper({
                requiredPlan: 'pro',
                showWatermark: true,
                showConsoleWarning: false,
            });
            function ComponentA() {
                return _jsx("div", { "data-testid": "a", children: "A" });
            }
            function ComponentB() {
                return _jsx("div", { "data-testid": "b", children: "B" });
            }
            const ProA = createProComponent(ComponentA, 'ComponentA');
            const ProB = createProComponent(ComponentB, 'ComponentB');
            render(_jsxs(_Fragment, { children: [_jsx(ProA, {}), _jsx(ProB, {})] }));
            // Both should render with watermarks
            expect(screen.getByTestId('a')).toBeInTheDocument();
            expect(screen.getByTestId('b')).toBeInTheDocument();
            expect(screen.getAllByRole('status')).toHaveLength(2);
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid license keys gracefully', () => {
            const result = verifyLicense('invalid-key-format');
            expect(result.status).toBe('Invalid');
            expect(result.reason).toBeDefined();
        });
        it('should handle null/undefined license keys', () => {
            expect(verifyLicense(null).status).toBe('Missing');
            expect(verifyLicense(undefined).status).toBe('Missing');
            expect(verifyLicense('').status).toBe('Missing');
        });
        it('should handle corrupted base64 in license key', () => {
            const result = verifyLicense('CC-1-!!!invalid-base64!!-checksum');
            expect(result.status).toBe('Invalid');
        });
    });
    describe('Grace Period Support', () => {
        it('should handle expired licenses with grace period', () => {
            // Generate an expired license
            const expiredKey = generateLicenseKey({
                orderNumber: 'CC-EXP-001',
                licensee: 'Expired Test',
                email: 'expired@test.com',
                plan: 'pro',
                scope: 'individual',
                durationDays: -30, // 30 days ago
            }, TEST_SECRET);
            const result = verifyLicense(expiredKey);
            // Expired licenses should be one of these statuses:
            // - 'GracePeriod' if within grace period
            // - 'Expired' if outside grace period
            // - 'ExpiredForDevelopment' in development mode
            expect(['GracePeriod', 'Expired', 'ExpiredForDevelopment']).toContain(result.status);
            expect(result.payload).toBeDefined();
        });
    });
});
//# sourceMappingURL=integration.test.js.map