import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';
describe('Badge Component', () => {
    describe('Rendering', () => {
        it('should render badge with text', () => {
            render(_jsx(Badge, { children: "New" }));
            expect(screen.getByText('New')).toBeInTheDocument();
        });
        it('should render with default variant', () => {
            const { container } = render(_jsx(Badge, { children: "Default" }));
            const badge = container.querySelector('.inline-flex');
            expect(badge).toBeInTheDocument();
        });
        it('should render with secondary variant', () => {
            const { container } = render(_jsx(Badge, { variant: "secondary", children: "Secondary" }));
            const badge = container.querySelector('.bg-secondary');
            expect(badge).toBeInTheDocument();
        });
        it('should render with destructive variant', () => {
            const { container } = render(_jsx(Badge, { variant: "destructive", children: "Error" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-destructive');
        });
        it('should render with outline variant', () => {
            const { container } = render(_jsx(Badge, { variant: "outline", children: "Outline" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-background');
        });
        it('should render with success variant', () => {
            const { container } = render(_jsx(Badge, { variant: "success", children: "Success" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-success');
        });
        it('should render with warning variant', () => {
            const { container } = render(_jsx(Badge, { variant: "warning", children: "Warning" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-warning');
        });
        it('should render with info variant', () => {
            const { container } = render(_jsx(Badge, { variant: "info", children: "Info" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('bg-info');
        });
        it('should render with small size', () => {
            const { container } = render(_jsx(Badge, { size: "sm", children: "Small" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-[10px]');
        });
        it('should render with large size', () => {
            const { container } = render(_jsx(Badge, { size: "lg", children: "Large" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('text-sm');
        });
    });
    describe('Styling', () => {
        it('should apply default styles', () => {
            const { container } = render(_jsx(Badge, { children: "Badge" }));
            const badge = container.querySelector('.inline-flex');
            expect(badge).toHaveClass('items-center', 'rounded-full');
        });
        it('should accept custom className', () => {
            const { container } = render(_jsx(Badge, { className: "custom-badge", children: "Custom" }));
            const badge = container.querySelector('.custom-badge');
            expect(badge).toBeInTheDocument();
        });
        it('should have proper padding', () => {
            const { container } = render(_jsx(Badge, { children: "Badge" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('px-3');
        });
    });
    describe('Accessibility', () => {
        it('should render as div element', () => {
            const { container } = render(_jsx(Badge, { children: "Badge" }));
            const badge = container.querySelector('div');
            expect(badge).toBeInTheDocument();
        });
        it('should support aria-label', () => {
            render(_jsx(Badge, { "aria-label": "Status badge", children: "New" }));
            expect(screen.getByLabelText('Status badge')).toBeInTheDocument();
        });
        it('should support role attribute', () => {
            render(_jsx(Badge, { role: "status", children: "Active" }));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });
    describe('Content', () => {
        it('should render with number', () => {
            render(_jsx(Badge, { children: "42" }));
            expect(screen.getByText('42')).toBeInTheDocument();
        });
        it('should render with icon', () => {
            const Icon = () => _jsx("span", { "data-testid": "icon", children: "\u2713" });
            render(_jsxs(Badge, { children: [_jsx(Icon, {}), "Active"] }));
            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
        });
        it('should render with complex content', () => {
            render(_jsxs(Badge, { children: [_jsx("span", { children: "Count:" }), " 5"] }));
            expect(screen.getByText(/Count:/)).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=badge.test.js.map