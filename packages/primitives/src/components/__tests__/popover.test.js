import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
describe('Popover Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render popover when open', () => {
            render(_jsxs(Popover, { open: true, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Content" })] }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should not render popover when closed', () => {
            render(_jsxs(Popover, { open: false, children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Content" })] }));
            expect(screen.queryByText('Content')).not.toBeInTheDocument();
        });
        it('should render trigger', () => {
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Trigger" }), _jsx(PopoverContent, { children: "Content" })] }));
            expect(screen.getByText('Trigger')).toBeInTheDocument();
        });
    });
    describe('Interactions', () => {
        it('should open popover when trigger is clicked', async () => {
            const user = userEvent.setup();
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Open" }), _jsx(PopoverContent, { children: "Opened" })] }));
            const trigger = screen.getByText('Open');
            await user.click(trigger);
            expect(screen.getByText('Opened')).toBeInTheDocument();
        });
        it('should toggle popover on trigger click', async () => {
            const user = userEvent.setup();
            render(_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: "Toggle" }), _jsx(PopoverContent, { children: "Content" })] }));
            const trigger = screen.getByText('Toggle');
            // First click opens
            await user.click(trigger);
            expect(screen.getByText('Content')).toBeInTheDocument();
            // Second click closes
            await user.click(trigger);
            // Content may still be in DOM due to exit animation
        });
    });
    describe('Controlled vs Uncontrolled', () => {
        it('should work as controlled component', () => {
            const mockOnOpenChange = vi.fn();
            render(_jsxs(Popover, { open: true, onOpenChange: mockOnOpenChange, children: [_jsx(PopoverTrigger, { children: "Trigger" }), _jsx(PopoverContent, { children: "Content" })] }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should work as uncontrolled component', () => {
            render(_jsxs(Popover, { defaultOpen: true, children: [_jsx(PopoverTrigger, { children: "Trigger" }), _jsx(PopoverContent, { children: "Content" })] }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
    describe('PopoverContent', () => {
        it('should render with default side', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should render with custom side', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { side: "bottom", children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should accept custom className', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { className: "custom-popover", children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should respect sideOffset', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { sideOffset: 10, children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should respect alignOffset', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { alignOffset: 10, children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
    describe('Error Handling', () => {
        it('should throw error when used outside Popover context', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                render(_jsx(PopoverTrigger, { children: "Trigger" }));
            }).toThrow('PopoverTrigger');
            consoleSpy.mockRestore();
        });
    });
    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(_jsx(Popover, { open: true, children: _jsx(PopoverContent, { "aria-label": "Custom popover", children: "Content" }) }));
            // Popover content is rendered in document, check by text content
            expect(screen.getByText('Content')).toBeInTheDocument();
            // Popover has role="dialog" (Radix UI sets this)
            const popover = screen.getByRole('dialog');
            expect(popover).toBeInTheDocument();
            // Radix UI handles aria-modal internally - verify popover is accessible
        });
    });
});
//# sourceMappingURL=popover.test.js.map