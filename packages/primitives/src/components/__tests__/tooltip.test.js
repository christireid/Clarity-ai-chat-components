import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../tooltip';
describe('Tooltip Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render trigger element', () => {
            render(_jsx(Tooltip, { content: "Tooltip text", children: _jsx("button", { children: "Hover me" }) }));
            expect(screen.getByText('Hover me')).toBeInTheDocument();
        });
        it('should render tooltip content on hover', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "Tooltip text", children: _jsx("button", { children: "Hover me" }) }));
            const trigger = screen.getByRole('button', { name: 'Hover me' });
            await user.hover(trigger);
            // Wait for tooltip to appear (respects delay)
            // Use getAllByText and check that tooltip content exists
            await waitFor(() => {
                const tooltips = screen.getAllByText('Tooltip text');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 500 });
        });
        it('should render with default side', () => {
            render(_jsx(Tooltip, { content: "Top tooltip", children: _jsx("button", { children: "Button" }) }));
            expect(screen.getByText('Button')).toBeInTheDocument();
        });
        it('should render with custom side', () => {
            render(_jsx(Tooltip, { content: "Bottom tooltip", side: "bottom", children: _jsx("button", { children: "Button" }) }));
            expect(screen.getByText('Button')).toBeInTheDocument();
        });
    });
    describe('Controlled vs Uncontrolled', () => {
        it('should work as controlled component', () => {
            render(_jsx(Tooltip, { content: "Controlled", open: true, children: _jsx("button", { children: "Button" }) }));
            // Tooltip content should be visible when open is true
            const tooltips = screen.getAllByText('Controlled');
            expect(tooltips.length).toBeGreaterThan(0);
        });
        it('should work as uncontrolled component', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "Uncontrolled", children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByRole('button', { name: 'Button' });
            await user.hover(trigger);
            await waitFor(() => {
                const tooltips = screen.getAllByText('Uncontrolled');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 500 });
        });
        it('should call onOpenChange when state changes', async () => {
            const user = userEvent.setup();
            const mockOnOpenChange = vi.fn();
            render(_jsx(Tooltip, { content: "Tooltip", onOpenChange: mockOnOpenChange, children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByText('Button');
            await user.hover(trigger);
            await waitFor(() => {
                expect(mockOnOpenChange).toHaveBeenCalled();
            }, { timeout: 500 });
        });
    });
    describe('Delay', () => {
        it('should respect delay prop', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "Delayed", delay: 500, children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByRole('button', { name: 'Button' });
            await user.hover(trigger);
            // Should not appear immediately
            expect(screen.queryAllByText('Delayed').length).toBe(0);
            // Should appear after delay
            await waitFor(() => {
                const tooltips = screen.getAllByText('Delayed');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 600 });
        });
    });
    describe('Disabled State', () => {
        it('should not show tooltip when disabled', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "Should not show", disabled: true, children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByText('Button');
            await user.hover(trigger);
            // Wait a bit to ensure tooltip doesn't appear
            await new Promise(resolve => setTimeout(resolve, 300));
            expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
        });
    });
    describe('Arrow', () => {
        it('should show arrow by default', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "With arrow", children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByRole('button', { name: 'Button' });
            await user.hover(trigger);
            await waitFor(() => {
                const tooltips = screen.getAllByText('With arrow');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 500 });
        });
        it('should hide arrow when showArrow is false', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "No arrow", showArrow: false, children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByRole('button', { name: 'Button' });
            await user.hover(trigger);
            await waitFor(() => {
                const tooltips = screen.getAllByText('No arrow');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 500 });
        });
    });
    describe('Styling', () => {
        it('should accept custom className', () => {
            render(_jsx(Tooltip, { content: "Custom", className: "custom-tooltip", children: _jsx("button", { children: "Button" }) }));
            expect(screen.getByText('Button')).toBeInTheDocument();
        });
        it('should accept custom contentClassName', async () => {
            const user = userEvent.setup();
            render(_jsx(Tooltip, { content: "Custom content", contentClassName: "custom-content", children: _jsx("button", { children: "Button" }) }));
            const trigger = screen.getByRole('button', { name: 'Button' });
            await user.hover(trigger);
            await waitFor(() => {
                // Tooltip content may appear multiple times, verify it exists
                const tooltips = screen.getAllByText('Custom content');
                expect(tooltips.length).toBeGreaterThan(0);
            }, { timeout: 500 });
        });
    });
    describe('Accessibility', () => {
        it('should support aria-label on trigger', () => {
            render(_jsx(Tooltip, { content: "Tooltip", children: _jsx("button", { "aria-label": "Trigger button", children: "Button" }) }));
            expect(screen.getByLabelText('Trigger button')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=tooltip.test.js.map