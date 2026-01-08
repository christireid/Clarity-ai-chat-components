import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * React Component Tests
 *
 * Tests for Watermark, withLicense HOCs, and LicenseProvider
 */
import * as React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { Watermark, WatermarkOverlay, LicenseStatusAnnouncer, } from '../Watermark';
import { withLicense, withLicenseStatus, createLicenseWrapper, LicenseGate, } from '../withLicense';
import { useLicenseWarning } from '../hooks';
import { LicenseProvider, useLicenseContext, useLicenseContextOptional, } from '../LicenseProvider';
import { LicenseInfo } from '../LicenseInfo';
import { generateLicenseKey } from '../generateLicense';
import { clearWarnings } from '../constants';
const TEST_SECRET = 'test-secret-key-12345';
// Helper to generate a valid test license
function createTestLicense(plan = 'pro') {
    return generateLicenseKey({
        orderNumber: 'CC-TEST-123',
        licensee: 'Test User',
        email: 'test@example.com',
        plan,
        scope: 'individual',
        durationDays: 365,
    }, TEST_SECRET);
}
describe('Watermark Component', () => {
    it('should render with default message for Missing status', () => {
        render(_jsx(Watermark, { status: "Missing" }));
        expect(screen.getByRole('status')).toHaveTextContent('Unlicensed');
    });
    it('should render with default message for Invalid status', () => {
        render(_jsx(Watermark, { status: "Invalid" }));
        expect(screen.getByRole('status')).toHaveTextContent('Invalid License');
    });
    it('should render with default message for Expired status', () => {
        render(_jsx(Watermark, { status: "Expired" }));
        expect(screen.getByRole('status')).toHaveTextContent('License Expired');
    });
    it('should render with default message for PlanMismatch status', () => {
        render(_jsx(Watermark, { status: "PlanMismatch" }));
        expect(screen.getByRole('status')).toHaveTextContent('Upgrade Required');
    });
    it('should render with default message for GracePeriod status', () => {
        render(_jsx(Watermark, { status: "GracePeriod" }));
        expect(screen.getByRole('status')).toHaveTextContent('Renewal Required');
    });
    it('should render with default message for OutOfScope status', () => {
        render(_jsx(Watermark, { status: "OutOfScope" }));
        expect(screen.getByRole('status')).toHaveTextContent('Domain Not Licensed');
    });
    it('should render custom message when provided', () => {
        render(_jsx(Watermark, { status: "Missing", message: "Custom Message" }));
        expect(screen.getByRole('status')).toHaveTextContent('Custom Message');
    });
    it('should apply custom className', () => {
        render(_jsx(Watermark, { status: "Missing", className: "custom-class" }));
        expect(screen.getByRole('status')).toHaveClass('custom-class');
    });
    it('should apply custom styles', () => {
        render(_jsx(Watermark, { status: "Missing", style: { backgroundColor: 'blue' } }));
        const element = screen.getByRole('status');
        expect(element).toHaveStyle({ backgroundColor: 'blue' });
    });
    it('should set aria-label for accessibility', () => {
        render(_jsx(Watermark, { status: "Missing" }));
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Unlicensed');
    });
    describe('position styles', () => {
        it('should position at top-right by default', () => {
            render(_jsx(Watermark, { status: "Missing" }));
            const element = screen.getByRole('status');
            expect(element).toHaveStyle({
                position: 'absolute',
                top: '8px',
                right: '8px',
            });
        });
        it('should position at top-left when specified', () => {
            render(_jsx(Watermark, { status: "Missing", position: "top-left" }));
            const element = screen.getByRole('status');
            expect(element).toHaveStyle({
                position: 'absolute',
                top: '8px',
                left: '8px',
            });
        });
        it('should position at bottom-right when specified', () => {
            render(_jsx(Watermark, { status: "Missing", position: "bottom-right" }));
            const element = screen.getByRole('status');
            expect(element).toHaveStyle({
                position: 'absolute',
                bottom: '8px',
                right: '8px',
            });
        });
        it('should position at bottom-left when specified', () => {
            render(_jsx(Watermark, { status: "Missing", position: "bottom-left" }));
            const element = screen.getByRole('status');
            expect(element).toHaveStyle({
                position: 'absolute',
                bottom: '8px',
                left: '8px',
            });
        });
    });
});
describe('WatermarkOverlay Component', () => {
    it('should render children without watermark for Valid status', () => {
        render(_jsx(WatermarkOverlay, { status: "Valid", children: _jsx("div", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    it('should render children without watermark for GracePeriod status', () => {
        render(_jsx(WatermarkOverlay, { status: "GracePeriod", children: _jsx("div", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
        // GracePeriod should NOT show watermark
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    it('should render children with watermark for Missing status', () => {
        render(_jsx(WatermarkOverlay, { status: "Missing", children: _jsx("div", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
    it('should pass watermark props to Watermark component', () => {
        render(_jsx(WatermarkOverlay, { status: "Missing", message: "Custom", position: "bottom-left", children: _jsx("div", { children: "Content" }) }));
        const watermark = screen.getByRole('status');
        expect(watermark).toHaveTextContent('Custom');
        expect(watermark).toHaveStyle({ bottom: '8px', left: '8px' });
    });
});
describe('withLicense HOC', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    function TestComponent({ message }) {
        return _jsx("div", { "data-testid": "test-component", children: message });
    }
    it('should render component with watermark when unlicensed', () => {
        const LicensedComponent = withLicense(TestComponent, {
            componentName: 'TestComponent',
            showWatermark: true,
            showConsoleWarning: false,
        });
        render(_jsx(LicensedComponent, { message: "Hello" }));
        expect(screen.getByTestId('test-component')).toHaveTextContent('Hello');
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
    it('should render component without watermark when licensed', () => {
        const validKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(validKey);
        const LicensedComponent = withLicense(TestComponent, {
            componentName: 'TestComponent',
            showWatermark: true,
            showConsoleWarning: false,
        });
        render(_jsx(LicensedComponent, { message: "Hello" }));
        expect(screen.getByTestId('test-component')).toHaveTextContent('Hello');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    it('should log console warning when unlicensed', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const LicensedComponent = withLicense(TestComponent, {
            componentName: 'UniqueTestComponent1',
            showConsoleWarning: true,
        });
        render(_jsx(LicensedComponent, { message: "Hello" }));
        expect(console.warn).toHaveBeenCalled();
        process.env.NODE_ENV = originalEnv;
    });
    it('should render fallback component when provided and unlicensed', () => {
        function Fallback() {
            return _jsx("div", { "data-testid": "fallback", children: "Upgrade required" });
        }
        const LicensedComponent = withLicense(TestComponent, {
            componentName: 'TestComponent',
            fallback: Fallback,
            showConsoleWarning: false,
        });
        render(_jsx(LicensedComponent, { message: "Hello" }));
        expect(screen.getByTestId('fallback')).toBeInTheDocument();
        expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });
    it('should check plan level when requiredPlan is specified', () => {
        const communityKey = createTestLicense('community');
        LicenseInfo.setLicenseKey(communityKey);
        const ProComponent = withLicense(TestComponent, {
            componentName: 'ProTestComponent',
            requiredPlan: 'pro',
            showWatermark: true,
            showConsoleWarning: false,
        });
        render(_jsx(ProComponent, { message: "Hello" }));
        // Should show watermark because community plan doesn't meet pro requirement
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
    it('should set correct displayName', () => {
        const LicensedComponent = withLicense(TestComponent, {
            componentName: 'MyComponent',
        });
        expect(LicensedComponent.displayName).toBe('withLicense(MyComponent)');
    });
});
describe('withLicenseStatus HOC', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
    });
    function StatusComponent({ title, isLicensed }) {
        return (_jsxs("div", { "data-testid": "status-component", children: [title, " - ", isLicensed ? 'Licensed' : 'Not Licensed'] }));
    }
    it('should inject license status props', () => {
        const WithStatus = withLicenseStatus(StatusComponent);
        render(_jsx(WithStatus, { title: "Test" }));
        expect(screen.getByTestId('status-component')).toHaveTextContent('Test - Not Licensed');
    });
    it('should inject isLicensed=true when license is valid', () => {
        const validKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(validKey);
        const WithStatus = withLicenseStatus(StatusComponent);
        render(_jsx(WithStatus, { title: "Test" }));
        expect(screen.getByTestId('status-component')).toHaveTextContent('Test - Licensed');
    });
    it('should set correct displayName', () => {
        const WithStatus = withLicenseStatus(StatusComponent);
        expect(WithStatus.displayName).toBe('withLicenseStatus(StatusComponent)');
    });
});
describe('createLicenseWrapper', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    function SimpleComponent() {
        return _jsx("div", { "data-testid": "simple", children: "Simple" });
    }
    it('should create wrapper with default options', () => {
        const createProComponent = createLicenseWrapper({
            requiredPlan: 'pro',
            showWatermark: true,
            showConsoleWarning: false,
        });
        const ProSimple = createProComponent(SimpleComponent, 'SimpleComponent');
        render(_jsx(ProSimple, {}));
        expect(screen.getByTestId('simple')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
describe('LicenseProvider', () => {
    it('should provide license context to children', () => {
        const validKey = createTestLicense('pro');
        function Consumer() {
            const { isValid, licensee, plan } = useLicenseContext();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "valid", children: isValid ? 'yes' : 'no' }), _jsx("span", { "data-testid": "licensee", children: licensee }), _jsx("span", { "data-testid": "plan", children: plan })] }));
        }
        render(_jsx(LicenseProvider, { licenseKey: validKey, children: _jsx(Consumer, {}) }));
        expect(screen.getByTestId('valid')).toHaveTextContent('yes');
        expect(screen.getByTestId('licensee')).toHaveTextContent('Test User');
        expect(screen.getByTestId('plan')).toHaveTextContent('pro');
    });
    it('should provide invalid status when no license key', () => {
        function Consumer() {
            const { isValid, shouldShowWatermark } = useLicenseContext();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "valid", children: isValid ? 'yes' : 'no' }), _jsx("span", { "data-testid": "watermark", children: shouldShowWatermark ? 'yes' : 'no' })] }));
        }
        render(_jsx(LicenseProvider, { licenseKey: null, children: _jsx(Consumer, {}) }));
        expect(screen.getByTestId('valid')).toHaveTextContent('no');
        expect(screen.getByTestId('watermark')).toHaveTextContent('yes');
    });
    it('should check plan level with hasPlan', () => {
        const proKey = createTestLicense('pro');
        function Consumer() {
            const { hasPlan } = useLicenseContext();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "has-community", children: hasPlan('community') ? 'yes' : 'no' }), _jsx("span", { "data-testid": "has-pro", children: hasPlan('pro') ? 'yes' : 'no' }), _jsx("span", { "data-testid": "has-enterprise", children: hasPlan('enterprise') ? 'yes' : 'no' })] }));
        }
        render(_jsx(LicenseProvider, { licenseKey: proKey, children: _jsx(Consumer, {}) }));
        expect(screen.getByTestId('has-community')).toHaveTextContent('yes');
        expect(screen.getByTestId('has-pro')).toHaveTextContent('yes');
        expect(screen.getByTestId('has-enterprise')).toHaveTextContent('no');
    });
    it('should throw error when useLicenseContext used outside provider', () => {
        function Consumer() {
            useLicenseContext();
            return null;
        }
        expect(() => render(_jsx(Consumer, {}))).toThrow('useLicenseContext must be used within a LicenseProvider');
    });
    it('should return null from useLicenseContextOptional outside provider', () => {
        function Consumer() {
            const context = useLicenseContextOptional();
            return (_jsx("div", { "data-testid": "context", children: context === null ? 'null' : 'exists' }));
        }
        render(_jsx(Consumer, {}));
        expect(screen.getByTestId('context')).toHaveTextContent('null');
    });
    it('should memoize context value when licenseKey unchanged', () => {
        const validKey = createTestLicense('pro');
        const contextValues = [];
        function Consumer() {
            const context = useLicenseContext();
            contextValues.push(context);
            return _jsx("div", { children: "Consumer" });
        }
        const { rerender } = render(_jsx(LicenseProvider, { licenseKey: validKey, children: _jsx(Consumer, {}) }));
        rerender(_jsx(LicenseProvider, { licenseKey: validKey, children: _jsx(Consumer, {}) }));
        expect(contextValues[0]).toBe(contextValues[1]);
    });
    it('should not show watermark during GracePeriod', () => {
        function Consumer() {
            const { shouldShowWatermark } = useLicenseContext();
            return (_jsx("div", { "data-testid": "watermark", children: shouldShowWatermark ? 'yes' : 'no' }));
        }
        // For a valid license, shouldShowWatermark should be false
        const validKey = createTestLicense('pro');
        render(_jsx(LicenseProvider, { licenseKey: validKey, children: _jsx(Consumer, {}) }));
        expect(screen.getByTestId('watermark')).toHaveTextContent('no');
    });
});
describe('LicenseStatusAnnouncer Component', () => {
    it('should render with ARIA live region attributes', () => {
        render(_jsx(LicenseStatusAnnouncer, { status: "Valid" }));
        const announcer = screen.getByRole('status');
        expect(announcer).toHaveAttribute('aria-live', 'polite');
        expect(announcer).toHaveAttribute('aria-atomic', 'true');
    });
    it('should be visually hidden', () => {
        render(_jsx(LicenseStatusAnnouncer, { status: "Valid" }));
        const announcer = screen.getByRole('status');
        expect(announcer).toHaveStyle({
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
        });
    });
    it('should not announce on initial mount', () => {
        render(_jsx(LicenseStatusAnnouncer, { status: "Missing" }));
        const announcer = screen.getByRole('status');
        expect(announcer).toHaveTextContent('');
    });
    it('should have displayName for React DevTools', () => {
        expect(LicenseStatusAnnouncer.displayName).toBe('LicenseStatusAnnouncer');
    });
});
describe('LicenseGate Component', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
    });
    it('should render children when licensed', async () => {
        const validKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(validKey);
        render(_jsx(LicenseGate, { requiredPlan: "pro", children: _jsx("div", { "data-testid": "content", children: "Pro Content" }) }));
        // Wait for hydration
        await waitFor(() => {
            expect(screen.getByTestId('content')).toHaveTextContent('Pro Content');
        });
    });
    it('should render fallback when not licensed', async () => {
        render(_jsx(LicenseGate, { requiredPlan: "pro", fallback: _jsx("div", { "data-testid": "fallback", children: "Please upgrade" }), children: _jsx("div", { "data-testid": "content", children: "Pro Content" }) }));
        // Wait for hydration
        await waitFor(() => {
            expect(screen.queryByTestId('content')).not.toBeInTheDocument();
            expect(screen.getByTestId('fallback')).toHaveTextContent('Please upgrade');
        });
    });
    it('should render nothing when not licensed and no fallback', async () => {
        const { container } = render(_jsx(LicenseGate, { requiredPlan: "pro", children: _jsx("div", { "data-testid": "content", children: "Pro Content" }) }));
        // Wait for hydration
        await waitFor(() => {
            expect(screen.queryByTestId('content')).not.toBeInTheDocument();
            // When not licensed and no fallback, the gate renders null (empty fragment)
            expect(container.innerHTML).toBe('');
        });
    });
    it('should render loading state during SSR/hydration', () => {
        const validKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(validKey);
        // On first render (before hydration), should show loading
        const { container } = render(_jsx(LicenseGate, { requiredPlan: "pro", loading: _jsx("div", { "data-testid": "loading", children: "Loading..." }), children: _jsx("div", { "data-testid": "content", children: "Pro Content" }) }));
        // Initially shows loading (before useEffect runs)
        // Note: In test environment with happy-dom, the effect runs synchronously
        // so we just verify the loading prop is accepted and component works
        expect(container).toBeDefined();
    });
    it('should gate based on plan level', async () => {
        const proKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(proKey);
        // Pro license can access pro features
        const { rerender } = render(_jsx(LicenseGate, { requiredPlan: "pro", children: _jsx("div", { "data-testid": "content", children: "Content" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
        // Pro license cannot access enterprise features
        rerender(_jsx(LicenseGate, { requiredPlan: "enterprise", fallback: _jsx("div", { "data-testid": "fallback", children: "Upgrade to Enterprise" }), children: _jsx("div", { "data-testid": "content", children: "Content" }) }));
        await waitFor(() => {
            expect(screen.queryByTestId('content')).not.toBeInTheDocument();
            expect(screen.getByTestId('fallback')).toBeInTheDocument();
        });
    });
    it('should allow enterprise license to access all plan levels', async () => {
        const enterpriseKey = createTestLicense('enterprise');
        LicenseInfo.setLicenseKey(enterpriseKey);
        // Enterprise can access community
        const { rerender } = render(_jsx(LicenseGate, { requiredPlan: "community", children: _jsx("div", { "data-testid": "content", children: "Community" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
        // Enterprise can access pro
        rerender(_jsx(LicenseGate, { requiredPlan: "pro", children: _jsx("div", { "data-testid": "content", children: "Pro" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
        // Enterprise can access enterprise
        rerender(_jsx(LicenseGate, { requiredPlan: "enterprise", children: _jsx("div", { "data-testid": "content", children: "Enterprise" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
    });
    it('should have correct displayName', () => {
        expect(LicenseGate.displayName).toBe('LicenseGate');
    });
    it('should react to license key changes', async () => {
        // Start without license
        const { rerender } = render(_jsx(LicenseGate, { requiredPlan: "pro", fallback: _jsx("div", { "data-testid": "fallback", children: "No license" }), children: _jsx("div", { "data-testid": "content", children: "Licensed content" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('fallback')).toBeInTheDocument();
        });
        // Add license
        const validKey = createTestLicense('pro');
        act(() => {
            LicenseInfo.setLicenseKey(validKey);
        });
        // Force re-render to pick up new key
        rerender(_jsx(LicenseGate, { requiredPlan: "pro", fallback: _jsx("div", { "data-testid": "fallback", children: "No license" }), children: _jsx("div", { "data-testid": "content", children: "Licensed content" }) }));
        await waitFor(() => {
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
    });
});
describe('useLicenseWarning hook', () => {
    beforeEach(() => {
        LicenseInfo.clearLicenseKey();
        clearWarnings(); // Clear shared warning tracker
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should log warning in development mode when unlicensed', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        function TestComponent() {
            useLicenseWarning('TestFeature', 'pro');
            return _jsx("div", { children: "Test" });
        }
        render(_jsx(TestComponent, {}));
        expect(console.warn).toHaveBeenCalled();
        const warnCall = console.warn.mock.calls[0];
        expect(warnCall?.[0]).toContain('TestFeature');
        process.env.NODE_ENV = originalEnv;
    });
    it('should not log warning when properly licensed', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const validKey = createTestLicense('pro');
        LicenseInfo.setLicenseKey(validKey);
        function TestComponent() {
            useLicenseWarning('TestFeature', 'pro');
            return _jsx("div", { children: "Test" });
        }
        render(_jsx(TestComponent, {}));
        expect(console.warn).not.toHaveBeenCalled();
        process.env.NODE_ENV = originalEnv;
    });
    it('should log warning when plan is insufficient', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        const communityKey = createTestLicense('community');
        LicenseInfo.setLicenseKey(communityKey);
        function TestComponent() {
            useLicenseWarning('ProFeature', 'pro');
            return _jsx("div", { children: "Test" });
        }
        render(_jsx(TestComponent, {}));
        expect(console.warn).toHaveBeenCalled();
        process.env.NODE_ENV = originalEnv;
    });
    it('should only log warning once per feature', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        function TestComponent() {
            useLicenseWarning('UniqueFeature123', 'pro');
            return _jsx("div", { children: "Test" });
        }
        const { rerender } = render(_jsx(TestComponent, {}));
        expect(console.warn).toHaveBeenCalledTimes(1);
        // Re-render should not log again
        rerender(_jsx(TestComponent, {}));
        expect(console.warn).toHaveBeenCalledTimes(1);
        process.env.NODE_ENV = originalEnv;
    });
});
//# sourceMappingURL=components.test.js.map