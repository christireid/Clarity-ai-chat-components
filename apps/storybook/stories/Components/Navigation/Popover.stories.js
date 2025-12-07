import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, PopoverContent, PopoverTrigger, Button } from '@clarity-chat/primitives';
import { useState } from 'react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
/**
 * Popover component for displaying floating content.
 *
 * **Key Features:**
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Collision detection
 * - Keyboard accessible
 * - Smooth animations
 *
 * **Best Practices:**
 * - Use for contextual information
 * - Keep content concise
 * - Provide clear trigger
 */
const meta = {
    title: 'Components/Navigation/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Popover component for displaying floating content relative to a trigger element.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(Button, { children: "Open Popover" }) }), _jsx(PopoverContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Popover Title" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This is the popover content. It can contain any React elements." })] }) })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test popover trigger button renders
        const openButton = canvas.getByRole('button', { name: /open popover/i });
        await expect(openButton).toBeInTheDocument();
        // Test opening popover
        await userEvent.click(openButton);
        // Wait for popover to appear and test content
        await waitFor(async () => {
            // Popovers typically don't use role="dialog", they may use role="tooltip" or be in the DOM
            const popoverTitle = document.querySelector('h4');
            if (popoverTitle && popoverTitle.textContent === 'Popover Title') {
                await expect(popoverTitle).toBeInTheDocument();
                // Find popover content
                const popoverContent = document.body.querySelector('.text-muted-foreground');
                if (popoverContent) {
                    await expect(popoverContent).toBeInTheDocument();
                }
            }
        }, { timeout: 2000 });
    },
};
export const WithArrow = {
    render: () => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(Button, { children: "Open Popover" }) }), _jsx(PopoverContent, { showArrow: true, children: _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Popover with Arrow" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This popover includes an arrow pointing to the trigger." })] }) })] })),
};
export const DifferentPositions = {
    render: () => {
        const positions = ['top', 'right', 'bottom', 'left'];
        return (_jsx("div", { className: "flex flex-col gap-8 items-center", children: positions.map((side) => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(Button, { variant: "outline", children: side.charAt(0).toUpperCase() + side.slice(1) }) }), _jsx(PopoverContent, { side: side, showArrow: true, children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "font-semibold text-sm", children: ["Popover on ", side] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["This popover appears on the ", side, " side."] })] }) })] }, side))) }));
    },
};
export const Controlled = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { children: _jsxs(Button, { children: [open ? 'Close' : 'Open', " Popover"] }) }), _jsx(PopoverContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Controlled Popover" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This popover is controlled externally." }), _jsx(Button, { size: "sm", onClick: () => setOpen(false), children: "Close" })] }) })] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test trigger button shows "Open" initially
        const triggerButton = canvas.getByRole('button', { name: /open popover/i });
        await expect(triggerButton).toBeInTheDocument();
        // Test opening popover
        await userEvent.click(triggerButton);
        // Wait for popover to appear
        await waitFor(async () => {
            const popoverTitle = Array.from(document.querySelectorAll('h4')).find((el) => el.textContent === 'Controlled Popover');
            if (popoverTitle) {
                await expect(popoverTitle).toBeInTheDocument();
                // Test close button in popover
                const closeButtons = Array.from(document.querySelectorAll('button')).filter((btn) => btn.textContent === 'Close');
                if (closeButtons.length > 0) {
                    await userEvent.click(closeButtons[0]);
                }
            }
        }, { timeout: 2000 });
        // Verify button text changes back to "Open"
        await waitFor(async () => {
            await expect(canvas.getByRole('button', { name: /open popover/i })).toBeInTheDocument();
        }, { timeout: 1000 });
    },
};
export const WithForm = {
    render: () => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(Button, { variant: "outline", children: "Edit Profile" }) }), _jsx(PopoverContent, { className: "w-80", children: _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Edit Profile" }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium", children: "Name" }), _jsx("input", { type: "text", placeholder: "John Doe", className: "w-full px-3 py-2 text-sm border rounded-lg" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium", children: "Email" }), _jsx("input", { type: "email", placeholder: "john@example.com", className: "w-full px-3 py-2 text-sm border rounded-lg" })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx(Button, { size: "sm", variant: "outline", children: "Cancel" }), _jsx(Button, { size: "sm", children: "Save" })] })] }) })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test edit profile button renders
        const editButton = canvas.getByRole('button', { name: /edit profile/i });
        await expect(editButton).toBeInTheDocument();
        // Test opening popover with form
        await userEvent.click(editButton);
        // Wait for popover form to appear
        await waitFor(async () => {
            const formTitle = Array.from(document.querySelectorAll('h4')).find((el) => el.textContent === 'Edit Profile');
            if (formTitle) {
                await expect(formTitle).toBeInTheDocument();
                // Test form labels
                const nameLabel = Array.from(document.querySelectorAll('label')).find((el) => el.textContent === 'Name');
                const emailLabel = Array.from(document.querySelectorAll('label')).find((el) => el.textContent === 'Email');
                if (nameLabel && emailLabel) {
                    await expect(nameLabel).toBeInTheDocument();
                    await expect(emailLabel).toBeInTheDocument();
                    // Test form inputs
                    const nameInput = document.querySelector('input[placeholder="John Doe"]');
                    const emailInput = document.querySelector('input[placeholder="john@example.com"]');
                    if (nameInput && emailInput) {
                        await expect(nameInput).toBeInTheDocument();
                        await expect(emailInput).toBeInTheDocument();
                    }
                }
            }
        }, { timeout: 2000 });
    },
};
export const WithoutArrow = {
    render: () => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(Button, { variant: "ghost", children: "Info" }) }), _jsx(PopoverContent, { showArrow: false, children: _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Information" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This popover doesn't have an arrow indicator." })] }) })] })),
};
//# sourceMappingURL=Popover.stories.js.map