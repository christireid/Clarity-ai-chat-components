import { jsx as _jsx } from "react/jsx-runtime";
/**
 * License UI Components Tests
 */
import * as React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LicenseLoadingSkeleton, LicenseStatusBadge, LicenseExpiryWarning, LicenseUpgradePrompt, } from '../LicenseUI';
import { LicenseInfo } from '../LicenseInfo';
import { generateLicenseKey } from '../generateLicense';
import { clearWarnings } from '../constants';
const TEST_SECRET = 'test-secret-key';
// Helper to generate a license key with specific expiry
function generateTestKey(options) {
    const { plan = 'pro', daysFromNow = 365 } = options;
    return generateLicenseKey({
        orderNumber: 'CC-TEST-001',
        licensee: 'Test User',
        email: 'test@example.com',
        plan,
        scope: 'individual',
        durationDays: daysFromNow,
    }, TEST_SECRET);
}
describe('LicenseLoadingSkeleton', () => {
    it('should render with default props', () => {
        render(_jsx(LicenseLoadingSkeleton, {}));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });
    it('should accept custom dimensions', () => {
        render(_jsx(LicenseLoadingSkeleton, { width: 200, height: 50 }));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
    });
    it('should accept string dimensions', () => {
        render(_jsx(LicenseLoadingSkeleton, { width: "50%", height: "2rem" }));
        const skeleton = screen.getByRole('status');
        // Browser may normalize rem to px, so just check the style attribute
        expect(skeleton.style.width).toBe('50%');
        expect(skeleton.style.height).toBe('2rem');
    });
    it('should apply custom className', () => {
        render(_jsx(LicenseLoadingSkeleton, { className: "custom-class" }));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveClass('custom-class');
    });
    it('should disable animation when animate=false', () => {
        render(_jsx(LicenseLoadingSkeleton, { animate: false }));
        const skeleton = screen.getByRole('status');
        expect(skeleton.style.animation).toBe('');
    });
});
describe('LicenseStatusBadge', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        clearWarnings();
    });
    it('should show "Unlicensed" when no license is set', async () => {
        render(_jsx(LicenseStatusBadge, {}));
        await waitFor(() => {
            expect(screen.getByText('Unlicensed')).toBeInTheDocument();
        });
    });
    it('should show "Licensed" when valid license is set', async () => {
        const key = generateTestKey({ plan: 'pro' });
        LicenseInfo.setLicenseKey(key);
        render(_jsx(LicenseStatusBadge, {}));
        await waitFor(() => {
            expect(screen.getByText('Licensed')).toBeInTheDocument();
        });
    });
    it('should show only icon in icon variant', async () => {
        render(_jsx(LicenseStatusBadge, { variant: "icon" }));
        await waitFor(() => {
            expect(screen.queryByText('Unlicensed')).not.toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });
    it('should show plan in full variant', async () => {
        const key = generateTestKey({ plan: 'enterprise' });
        LicenseInfo.setLicenseKey(key);
        render(_jsx(LicenseStatusBadge, { variant: "full" }));
        await waitFor(() => {
            expect(screen.getByText('(enterprise)')).toBeInTheDocument();
        });
    });
    it('should call onClick when clicked', async () => {
        const handleClick = vi.fn();
        render(_jsx(LicenseStatusBadge, { onClick: handleClick }));
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('should show different sizes', async () => {
        const { rerender } = render(_jsx(LicenseStatusBadge, { size: "sm" }));
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveStyle({ fontSize: '11px' });
        });
        rerender(_jsx(LicenseStatusBadge, { size: "lg" }));
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveStyle({ fontSize: '14px' });
        });
    });
});
describe('LicenseExpiryWarning', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        clearWarnings();
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('clarity-license-expiry-dismissed');
        }
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should not render when no license is set', () => {
        const { container } = render(_jsx(LicenseExpiryWarning, {}));
        expect(container.innerHTML).toBe('');
    });
    it('should not render when license is not expiring soon', async () => {
        const key = generateTestKey({ daysFromNow: 365 });
        LicenseInfo.setLicenseKey(key);
        const { container } = render(_jsx(LicenseExpiryWarning, { daysThreshold: 30 }));
        // Wait for hydration
        await waitFor(() => {
            expect(container.innerHTML).toBe('');
        });
    });
    it('should render when license is expiring within threshold', async () => {
        const key = generateTestKey({ daysFromNow: 15 });
        LicenseInfo.setLicenseKey(key);
        render(_jsx(LicenseExpiryWarning, { daysThreshold: 30 }));
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText(/expires in/i)).toBeInTheDocument();
        });
    });
    it('should show urgent styling when expiring in 7 days or less', async () => {
        const key = generateTestKey({ daysFromNow: 5 });
        LicenseInfo.setLicenseKey(key);
        render(_jsx(LicenseExpiryWarning, { daysThreshold: 30 }));
        await waitFor(() => {
            expect(screen.getByText(/expires in 5 days/i)).toBeInTheDocument();
        });
    });
    it('should dismiss when dismiss button is clicked', async () => {
        const key = generateTestKey({ daysFromNow: 15 });
        LicenseInfo.setLicenseKey(key);
        const onDismiss = vi.fn();
        render(_jsx(LicenseExpiryWarning, { daysThreshold: 30, onDismiss: onDismiss }));
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('Dismiss'));
        });
        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    it('should call onRenew when renew button is clicked', async () => {
        const key = generateTestKey({ daysFromNow: 15 });
        LicenseInfo.setLicenseKey(key);
        const onRenew = vi.fn();
        render(_jsx(LicenseExpiryWarning, { daysThreshold: 30, onRenew: onRenew }));
        await waitFor(() => {
            fireEvent.click(screen.getByText('Renew Now'));
        });
        expect(onRenew).toHaveBeenCalledTimes(1);
    });
    it('should open URL when renewUrl is provided and no onRenew', async () => {
        const key = generateTestKey({ daysFromNow: 15 });
        LicenseInfo.setLicenseKey(key);
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        render(_jsx(LicenseExpiryWarning, { daysThreshold: 30, renewUrl: "https://example.com/renew" }));
        await waitFor(() => {
            fireEvent.click(screen.getByText('Renew Now'));
        });
        expect(openSpy).toHaveBeenCalledWith('https://example.com/renew', '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });
});
describe('LicenseUpgradePrompt', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        clearWarnings();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should render card variant by default', () => {
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro" }));
        expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
        expect(screen.getByText('Upgrade Now')).toBeInTheDocument();
    });
    it('should render minimal variant', () => {
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", variant: "minimal" }));
        expect(screen.getByText(/requires/i)).toBeInTheDocument();
        expect(screen.getByText('Upgrade')).toBeInTheDocument();
    });
    it('should render inline variant', () => {
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", variant: "inline" }));
        expect(screen.getByText('Pro Feature')).toBeInTheDocument();
        expect(screen.getByText('🔒')).toBeInTheDocument();
    });
    it('should show custom feature name', () => {
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "enterprise", featureName: "Advanced Analytics" }));
        expect(screen.getByText(/Advanced Analytics requires a Enterprise license/i)).toBeInTheDocument();
    });
    it('should show custom benefits', () => {
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", benefits: ['Benefit A', 'Benefit B'] }));
        expect(screen.getByText('Benefit A')).toBeInTheDocument();
        expect(screen.getByText('Benefit B')).toBeInTheDocument();
    });
    it('should call onUpgrade when button is clicked', () => {
        const onUpgrade = vi.fn();
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", onUpgrade: onUpgrade }));
        fireEvent.click(screen.getByText('Upgrade Now'));
        expect(onUpgrade).toHaveBeenCalledTimes(1);
    });
    it('should open URL when upgradeUrl is provided and no onUpgrade', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", upgradeUrl: "https://example.com/upgrade" }));
        fireEvent.click(screen.getByText('Upgrade Now'));
        expect(openSpy).toHaveBeenCalledWith('https://example.com/upgrade', '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });
    it('should show current plan when license is set', async () => {
        // Use 'pro' plan since it will be shown in "You're currently on Pro"
        const key = generateTestKey({ plan: 'pro' });
        LicenseInfo.setLicenseKey(key);
        render(_jsx(LicenseUpgradePrompt, { requiredPlan: "enterprise" }));
        await waitFor(() => {
            // Check the "You're currently on Pro" text
            expect(screen.getByText(/You're currently on Pro/)).toBeInTheDocument();
        });
    });
    it('should apply custom className', () => {
        const { container } = render(_jsx(LicenseUpgradePrompt, { requiredPlan: "pro", className: "custom-class" }));
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
//# sourceMappingURL=LicenseUI.test.js.map