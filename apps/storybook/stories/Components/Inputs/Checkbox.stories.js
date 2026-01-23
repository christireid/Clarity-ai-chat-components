import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from '@clarity-chat/primitives';
import { useState } from 'react';
import { expect, userEvent, within } from '@storybook/test';
/**
 * Checkbox component for binary selection.
 *
 * **Key Features:**
 * - Accessible with proper ARIA attributes
 * - Focus states with ring indicator
 * - Disabled state support
 * - Smooth transitions
 *
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Use for single or multiple selections
 * - Group related checkboxes together
 */
const meta = {
    title: 'Components/Inputs/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Checkbox input component for binary selection with accessible focus states.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    decorators: [
        (Story) => (_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "checkbox-default", checked: checked, onChange: (e) => setChecked(e.target.checked) }), _jsx("label", { htmlFor: "checkbox-default", className: "text-sm font-medium cursor-pointer", children: "Accept terms and conditions" })] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test checkbox renders unchecked initially
        const checkbox = canvas.getByRole('checkbox');
        await expect(checkbox).toBeInTheDocument();
        await expect(checkbox).not.toBeChecked();
        // Test clicking checkbox toggles it
        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
        // Test clicking again unchecks it
        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
    },
};
export const Checked = {
    render: () => {
        const [checked, setChecked] = useState(true);
        return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "checkbox-checked", checked: checked, onChange: (e) => setChecked(e.target.checked) }), _jsx("label", { htmlFor: "checkbox-checked", className: "text-sm font-medium cursor-pointer", children: "Newsletter subscription" })] }));
    },
};
export const Disabled = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "checkbox-disabled-unchecked", disabled: true }), _jsx("label", { htmlFor: "checkbox-disabled-unchecked", className: "text-sm text-muted-foreground", children: "Disabled unchecked" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "checkbox-disabled-checked", checked: true, disabled: true }), _jsx("label", { htmlFor: "checkbox-disabled-checked", className: "text-sm text-muted-foreground", children: "Disabled checked" })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test disabled checkboxes
        const checkboxes = canvas.getAllByRole('checkbox');
        // First checkbox should be disabled and unchecked
        await expect(checkboxes[0]).toBeDisabled();
        await expect(checkboxes[0]).not.toBeChecked();
        // Second checkbox should be disabled and checked
        await expect(checkboxes[1]).toBeDisabled();
        await expect(checkboxes[1]).toBeChecked();
    },
};
export const WithLabel = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Checkbox, { id: "checkbox-label", checked: checked, onChange: (e) => setChecked(e.target.checked), className: "mt-0.5" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { htmlFor: "checkbox-label", className: "text-sm font-medium cursor-pointer", children: "Enable notifications" }), _jsx("span", { className: "text-xs text-muted-foreground", children: "Receive updates about your account activity" })] })] }));
    },
};
export const MultipleOptions = {
    render: () => {
        const [options, setOptions] = useState({
            email: false,
            sms: false,
            push: true,
        });
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Notification preferences" }), Object.entries(options).map(([key, checked]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: `checkbox-${key}`, checked: checked, onChange: (e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked })) }), _jsx("label", { htmlFor: `checkbox-${key}`, className: "text-sm font-medium cursor-pointer capitalize", children: key })] }, key)))] }));
    },
};
export const FocusState = {
    render: () => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Checkbox, { id: "checkbox-focus", autoFocus: true }), _jsx("label", { htmlFor: "checkbox-focus", className: "text-sm font-medium", children: "Focused checkbox (check focus ring)" })] })),
};
//# sourceMappingURL=Checkbox.stories.js.map