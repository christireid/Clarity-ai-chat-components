import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose, } from '../dialog';
import { Button } from '../button';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Checkbox } from '../checkbox';
/**
 * Integration tests for component interactions
 *
 * These tests verify that components work correctly together,
 * especially around focus management, ARIA relationships, and
 * state synchronization.
 */
describe('Integration Tests', () => {
    beforeEach(() => {
        // Clean up any portal elements
        const portalRoot = document.getElementById('dialog-portal-root');
        if (portalRoot)
            portalRoot.remove();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('Dialog with Form Components', () => {
        it('renders form inputs inside dialog correctly', async () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Contact Form" }), _jsx(DialogDescription, { children: "Fill out the form below" })] }), _jsxs(DialogBody, { children: [_jsx(Input, { label: "Name", placeholder: "Enter name" }), _jsx(Input, { label: "Email", type: "email", placeholder: "Enter email" })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Cancel" }) }), _jsx(Button, { children: "Submit" })] })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            expect(screen.getByLabelText('Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });
        it('maintains focus trap with multiple inputs', async () => {
            const user = userEvent.setup();
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Form" }) }), _jsxs(DialogBody, { children: [_jsx(Input, { label: "First", "data-testid": "first-input" }), _jsx(Input, { label: "Second", "data-testid": "second-input" })] }), _jsx(DialogFooter, { children: _jsx(Button, { "data-testid": "submit-btn", children: "Submit" }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            // First focusable element should receive focus
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();
            // Tab through elements
            await user.tab();
            await user.tab();
            await user.tab();
            // Should cycle within dialog (not escape to body)
            const focusedElement = document.activeElement;
            expect(dialog.contains(focusedElement)).toBe(true);
        });
        it('handles input clear button within dialog', async () => {
            const user = userEvent.setup();
            function DialogWithClearableInput() {
                const [value, setValue] = React.useState('Hello World');
                return (_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Clear Test" }) }), _jsx(DialogBody, { children: _jsx(Input, { label: "Message", value: value, onChange: (e) => setValue(e.target.value), clearable: true, onClear: () => setValue(''), "data-testid": "clearable-input" }) })] }) }));
            }
            // Import React for the component
            const React = await import('react');
            render(_jsx(DialogWithClearableInput, {}));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            const input = screen.getByTestId('clearable-input');
            expect(input).toHaveValue('Hello World');
            // Find and click clear button
            const clearButton = screen.getByRole('button', { name: /clear/i });
            await user.click(clearButton);
            await waitFor(() => {
                expect(input).toHaveValue('');
            });
        });
    });
    describe('Dialog with Textarea', () => {
        it('renders textarea with character count in dialog', async () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Comment" }) }), _jsx(DialogBody, { children: _jsx(Textarea, { label: "Your comment", maxLength: 100, showCharacterCount: true, placeholder: "Write something..." }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            expect(screen.getByLabelText('Your comment')).toBeInTheDocument();
            expect(screen.getByText('0/100')).toBeInTheDocument();
        });
    });
    describe('Dialog with Checkbox', () => {
        it('renders checkbox with description in dialog', async () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Settings" }) }), _jsx(DialogBody, { children: _jsx(Checkbox, { label: "Enable notifications", description: "Receive push notifications for updates" }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
            expect(screen.getByText('Enable notifications')).toBeInTheDocument();
            expect(screen.getByText('Receive push notifications for updates')).toBeInTheDocument();
        });
        it('handles checkbox state changes in dialog', async () => {
            const user = userEvent.setup();
            const onCheckedChange = vi.fn();
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Terms" }) }), _jsx(DialogBody, { children: _jsx(Checkbox, { label: "I accept the terms", onCheckedChange: onCheckedChange }) }), _jsx(DialogFooter, { children: _jsx(Button, { children: "Continue" }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            const checkbox = screen.getByRole('checkbox');
            await user.click(checkbox);
            expect(onCheckedChange).toHaveBeenCalledWith(true);
        });
    });
    describe('Button in DialogFooter', () => {
        it('handles button loading state in dialog', async () => {
            const user = userEvent.setup();
            function DialogWithAsyncSubmit() {
                const [isLoading, setIsLoading] = React.useState(false);
                const handleSubmit = async () => {
                    setIsLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    setIsLoading(false);
                };
                return (_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Confirm" }) }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { onClick: handleSubmit, loading: isLoading, children: isLoading ? 'Saving...' : 'Save' })] })] }) }));
            }
            const React = await import('react');
            render(_jsx(DialogWithAsyncSubmit, {}));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            const submitButton = screen.getByRole('button', { name: /save/i });
            expect(submitButton).not.toBeDisabled();
            await user.click(submitButton);
            // Button should show loading state
            await waitFor(() => {
                expect(screen.getByText('Saving...')).toBeInTheDocument();
            });
            // Loading should complete
            await waitFor(() => {
                expect(screen.getByText('Save')).toBeInTheDocument();
            }, { timeout: 500 });
        });
    });
    describe('Escape key handling', () => {
        it('closes dialog on Escape key', async () => {
            const user = userEvent.setup();
            const onOpenChange = vi.fn();
            render(_jsx(Dialog, { defaultOpen: true, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Test Dialog" }) }), _jsx(DialogBody, { children: _jsx(Input, { label: "Name" }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            await user.keyboard('{Escape}');
            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
        it('does not close dialog when closeOnEscape is false', async () => {
            const user = userEvent.setup();
            const onOpenChange = vi.fn();
            render(_jsx(Dialog, { defaultOpen: true, onOpenChange: onOpenChange, children: _jsx(DialogContent, { closeOnEscape: false, children: _jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Persistent Dialog" }) }) }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            await user.keyboard('{Escape}');
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    });
    describe('ARIA relationships', () => {
        it('correctly links dialog title and description', async () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsx(DialogContent, { children: _jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Important Notice" }), _jsx(DialogDescription, { children: "Please read the following information carefully." })] }) }) }));
            await waitFor(() => {
                const dialog = screen.getByRole('dialog');
                expect(dialog).toBeInTheDocument();
                const labelledBy = dialog.getAttribute('aria-labelledby');
                const describedBy = dialog.getAttribute('aria-describedby');
                expect(labelledBy).toBeTruthy();
                expect(describedBy).toBeTruthy();
                // Title and description should exist with matching IDs
                const title = screen.getByText('Important Notice');
                const description = screen.getByText('Please read the following information carefully.');
                expect(title.id).toBe(labelledBy);
                expect(description.id).toBe(describedBy);
            });
        });
        it('input error is properly linked via aria-describedby', async () => {
            render(_jsx(Dialog, { defaultOpen: true, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Form" }) }), _jsx(DialogBody, { children: _jsx(Input, { label: "Email", error: "Invalid email address", "data-testid": "email-input" }) })] }) }));
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
            const input = screen.getByTestId('email-input');
            const describedBy = input.getAttribute('aria-describedby');
            const errorMessage = screen.getByText('Invalid email address');
            expect(describedBy).toContain(errorMessage.closest('[id]')?.id || '');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });
    });
    describe('Rapid open/close handling', () => {
        it('handles rapid toggle without errors', async () => {
            const user = userEvent.setup();
            function RapidToggleDialog() {
                const [open, setOpen] = React.useState(false);
                return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Toggle" }) }), _jsx(DialogContent, { children: _jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Rapid Toggle Test" }) }) })] }));
            }
            const React = await import('react');
            render(_jsx(RapidToggleDialog, {}));
            const trigger = screen.getByRole('button', { name: /toggle/i });
            // Rapidly click multiple times
            await user.click(trigger);
            await user.click(trigger);
            await user.click(trigger);
            await user.click(trigger);
            // Should not throw and final state should be consistent
            // (either open or closed, not in invalid state)
            await waitFor(() => {
                // Just verify no errors occurred
                expect(document.body).toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=integration.test.js.map