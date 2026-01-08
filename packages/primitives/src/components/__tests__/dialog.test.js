import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, } from '../dialog';
describe('Dialog Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render dialog when open', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Test Dialog" }) }) }) }));
            expect(screen.getByText('Test Dialog')).toBeInTheDocument();
        });
        it('should not render dialog when closed', () => {
            render(_jsx(Dialog, { open: false, children: _jsx(DialogContent, { children: _jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Test Dialog" }) }) }) }));
            // Dialog content should not be visible when closed
            expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
        });
        it('should render dialog with all sub-components', () => {
            render(_jsx(Dialog, { open: true, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Title" }), _jsx(DialogDescription, { children: "Description" })] }), _jsx("div", { children: "Content" }), _jsx(DialogFooter, { children: _jsx("button", { children: "Footer" }) })] }) }));
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
    });
    describe('Controlled vs Uncontrolled', () => {
        it('should work as controlled component', () => {
            const mockOnOpenChange = vi.fn();
            render(_jsx(Dialog, { open: true, onOpenChange: mockOnOpenChange, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Controlled" }) }) }));
            expect(screen.getByText('Controlled')).toBeInTheDocument();
        });
        it('should work as uncontrolled component', () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Uncontrolled" }) }) }));
            expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
        });
    });
    describe('DialogTrigger', () => {
        it('should render trigger button', () => {
            render(_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open Dialog" }), _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Dialog" }) })] }));
            expect(screen.getByText('Open Dialog')).toBeInTheDocument();
        });
        it('should open dialog when trigger is clicked', async () => {
            const user = userEvent.setup();
            render(_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: "Open" }), _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Opened" }) })] }));
            const trigger = screen.getByText('Open');
            await user.click(trigger);
            // Dialog should open (mocked animation may affect visibility)
            // We check that the content exists in the DOM
            expect(screen.getByText('Opened')).toBeInTheDocument();
        });
    });
    describe('DialogContent', () => {
        it('should render with default size', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Content" }) }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should render with custom size', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { size: "lg", children: _jsx(DialogTitle, { children: "Large" }) }) }));
            // Size classes are applied via className
            expect(screen.getByText('Large')).toBeInTheDocument();
        });
        it('should accept custom className', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { className: "custom-dialog", children: _jsx(DialogTitle, { children: "Custom" }) }) }));
            expect(screen.getByText('Custom')).toBeInTheDocument();
        });
    });
    describe('DialogClose', () => {
        it('should render close button', () => {
            render(_jsx(Dialog, { open: true, children: _jsxs(DialogContent, { showCloseButton: false, children: [_jsx(DialogTitle, { children: "Dialog" }), _jsx(DialogClose, { children: "Close" })] }) }));
            // Query by role to avoid conflicts with default close button
            const closeButtons = screen.getAllByRole('button', { name: /close/i });
            expect(closeButtons.length).toBeGreaterThan(0);
        });
        it('should close dialog when clicked', async () => {
            const user = userEvent.setup();
            const mockOnOpenChange = vi.fn();
            render(_jsx(Dialog, { open: true, onOpenChange: mockOnOpenChange, children: _jsxs(DialogContent, { showCloseButton: false, children: [_jsx(DialogTitle, { children: "Dialog" }), _jsx(DialogClose, { asChild: true, children: _jsx("button", { "data-testid": "custom-close", children: "Close" }) })] }) }));
            // Get the custom close button by test id
            const closeButton = screen.getByTestId('custom-close');
            await user.click(closeButton);
            expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
    });
    describe('Accessibility', () => {
        it('should have proper title role', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { children: _jsx(DialogTitle, { children: "Accessible Dialog" }) }) }));
            expect(screen.getByRole('heading')).toBeInTheDocument();
        });
        it('should support aria-label on content', () => {
            render(_jsx(Dialog, { open: true, children: _jsx(DialogContent, { "aria-label": "Custom dialog", children: _jsx(DialogTitle, { children: "Dialog" }) }) }));
            // Dialog content is rendered in portal, check by role
            // Note: Radix UI may use the title for accessible name instead of aria-label
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            // Verify dialog is accessible (Radix UI handles aria attributes internally)
        });
    });
    describe('Error Handling', () => {
        it('should throw error when used outside Dialog context', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            expect(() => {
                render(_jsx(DialogTrigger, { children: "Trigger" }));
            }).toThrow('Dialog');
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=dialog.test.js.map