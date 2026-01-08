import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Tests for Demo page components
 * Tests rendering, theme switching, and component showcases
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DemoPage, ButtonsDemo, StatusBadgesDemo } from '../components/demo';
describe('DemoPage', () => {
    it('renders with default theme', () => {
        render(_jsx(DemoPage, {}));
        expect(screen.getByText('Clarity Dev Tools Demo')).toBeTruthy();
        expect(screen.getByText('Premium Developer Tools for AI Chat Applications')).toBeTruthy();
    });
    it('renders with light theme', () => {
        const { container } = render(_jsx(DemoPage, { theme: "light" }));
        const root = container.querySelector('.demo-page');
        expect(root).toBeTruthy();
        expect(root?.classList.contains('dev-tools-dark')).toBe(false);
    });
    it('renders with dark theme', () => {
        const { container } = render(_jsx(DemoPage, { theme: "dark" }));
        const root = container.querySelector('.demo-page');
        expect(root?.classList.contains('dev-tools-dark')).toBe(true);
    });
    it('shows theme selector', () => {
        render(_jsx(DemoPage, {}));
        const select = screen.getByRole('combobox', { name: /select theme/i });
        expect(select).toBeTruthy();
        expect(select).toHaveProperty('value', 'auto');
    });
    it('changes theme when selected', () => {
        const { container } = render(_jsx(DemoPage, { theme: "light" }));
        const select = screen.getByRole('combobox', { name: /select theme/i });
        fireEvent.change(select, { target: { value: 'dark' } });
        const root = container.querySelector('.demo-page');
        expect(root?.classList.contains('dev-tools-dark')).toBe(true);
    });
    it('toggles between dashboard and icons view', () => {
        render(_jsx(DemoPage, {}));
        // Initially shows dashboard
        const toggleButton = screen.getByRole('button', { name: /show icons/i });
        expect(toggleButton).toBeTruthy();
        // Click to show icons
        fireEvent.click(toggleButton);
        expect(screen.getByText('Icon Library')).toBeTruthy();
        // Click to show dashboard again
        const showDashboardButton = screen.getByRole('button', {
            name: /show dashboard/i,
        });
        fireEvent.click(showDashboardButton);
    });
    it('renders features list', () => {
        render(_jsx(DemoPage, {}));
        expect(screen.getByText('Features')).toBeTruthy();
        expect(screen.getByText('React 19 with useOptimistic')).toBeTruthy();
        expect(screen.getByText('90+ CSS Custom Properties')).toBeTruthy();
        expect(screen.getByText('Light & Dark Mode')).toBeTruthy();
        expect(screen.getByText('Keyboard Navigation')).toBeTruthy();
        expect(screen.getByText('ARIA Accessibility')).toBeTruthy();
    });
    it('renders header content', () => {
        const { container } = render(_jsx(DemoPage, {}));
        const header = container.querySelector('.demo-header');
        expect(header).toBeTruthy();
        expect(header?.querySelector('h1')?.textContent).toBe('Clarity Dev Tools Demo');
    });
});
describe('ButtonsDemo', () => {
    it('renders all button variants', () => {
        render(_jsx(ButtonsDemo, {}));
        expect(screen.getByText('Button Variants')).toBeTruthy();
        expect(screen.getByRole('button', { name: /primary/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /secondary/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /ghost/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /danger/i })).toBeTruthy();
    });
    it('renders button sizes', () => {
        render(_jsx(ButtonsDemo, {}));
        expect(screen.getByRole('button', { name: /small/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /medium/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /large/i })).toBeTruthy();
    });
    it('renders disabled button', () => {
        render(_jsx(ButtonsDemo, {}));
        const disabledButton = screen.getByRole('button', { name: /disabled/i });
        expect(disabledButton).toHaveProperty('disabled', true);
    });
    it('renders button with icon', () => {
        render(_jsx(ButtonsDemo, {}));
        const iconButton = screen.getByRole('button', { name: /with icon/i });
        expect(iconButton).toBeTruthy();
        expect(iconButton.querySelector('svg')).toBeTruthy();
    });
    it('renders icon-only button', () => {
        render(_jsx(ButtonsDemo, {}));
        const iconOnlyButton = screen.getByRole('button', { name: /icon only/i });
        expect(iconOnlyButton).toBeTruthy();
        expect(iconOnlyButton.querySelector('svg')).toBeTruthy();
    });
});
describe('StatusBadgesDemo', () => {
    it('renders all status badges', () => {
        render(_jsx(StatusBadgesDemo, {}));
        expect(screen.getByText('Status Badges')).toBeTruthy();
        expect(screen.getByText('Success')).toBeTruthy();
        expect(screen.getByText('Warning')).toBeTruthy();
        expect(screen.getByText('Error')).toBeTruthy();
        expect(screen.getByText('Pending')).toBeTruthy();
    });
    it('badges have correct class names', () => {
        const { container } = render(_jsx(StatusBadgesDemo, {}));
        expect(container.querySelector('.status-badge.success')).toBeTruthy();
        expect(container.querySelector('.status-badge.warning')).toBeTruthy();
        expect(container.querySelector('.status-badge.error')).toBeTruthy();
        expect(container.querySelector('.status-badge.pending')).toBeTruthy();
    });
    it('badges contain icons', () => {
        render(_jsx(StatusBadgesDemo, {}));
        const badges = document.querySelectorAll('.status-badge');
        badges.forEach((badge) => {
            expect(badge.querySelector('svg')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=demo.test.js.map