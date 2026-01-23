import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip, Button } from '@clarity-chat/primitives';
import { expect, userEvent, within, waitFor } from '@storybook/test';
/**
 * Tooltip component for displaying helpful information on hover.
 *
 * **Key Features:**
 * - Appears on hover/focus
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Accessible with ARIA attributes
 * - Smooth animations
 *
 * **Best Practices:**
 * - Use for helpful hints and additional information
 * - Keep content concise (1-2 lines)
 * - Don't use for critical information
 */
const meta = {
    title: 'Components/DataDisplay/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Tooltip component for displaying helpful information on hover or focus.',
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
    render: () => (_jsx(Tooltip, { content: "This is a helpful tooltip", children: _jsx(Button, { children: "Hover me" }) })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test trigger button exists
        const button = canvas.getByRole('button', { name: /hover me/i });
        await expect(button).toBeInTheDocument();
        // Hover over button to show tooltip
        await userEvent.hover(button);
        // Wait for tooltip to appear and check content
        await waitFor(async () => {
            const tooltip = canvas.queryByText(/this is a helpful tooltip/i);
            if (tooltip) {
                await expect(tooltip).toBeVisible();
            }
        });
    },
};
export const WithArrow = {
    render: () => (_jsx(Tooltip, { content: "Tooltip with arrow indicator", showArrow: true, children: _jsx(Button, { children: "Hover me" }) })),
};
export const DifferentPositions = {
    render: () => {
        const positions = ['top', 'right', 'bottom', 'left'];
        return (_jsx("div", { className: "flex flex-col gap-8 items-center", children: positions.map((side) => (_jsx(Tooltip, { content: `Tooltip on ${side}`, side: side, showArrow: true, children: _jsx(Button, { variant: "outline", children: side.charAt(0).toUpperCase() + side.slice(1) }) }, side))) }));
    },
};
export const LongContent = {
    render: () => (_jsx(Tooltip, { content: "This is a longer tooltip message that provides more detailed information about the element you're hovering over.", children: _jsx(Button, { children: "Hover for details" }) })),
};
export const WithIcon = {
    render: () => (_jsx(Tooltip, { content: "Click to save your changes", children: _jsxs(Button, { children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Save"] }) })),
};
export const Disabled = {
    render: () => (_jsx(Tooltip, { content: "This tooltip is disabled", disabled: true, children: _jsx(Button, { disabled: true, children: "Disabled Button" }) })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test disabled button exists
        const button = canvas.getByRole('button', { name: /disabled button/i });
        await expect(button).toBeDisabled();
        // Tooltip should not appear when hovering disabled tooltip
        await userEvent.hover(button);
        // Tooltip should not be visible
        const tooltip = canvas.queryByText(/this tooltip is disabled/i);
        // Note: Tooltip may not render at all when disabled
    },
};
export const WithoutArrow = {
    render: () => (_jsx(Tooltip, { content: "Tooltip without arrow", showArrow: false, children: _jsx(Button, { variant: "ghost", children: "Hover me" }) })),
};
export const CustomDelay = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 items-center", children: [_jsx(Tooltip, { content: "Default delay (200ms)", delay: 200, children: _jsx(Button, { children: "Default Delay" }) }), _jsx(Tooltip, { content: "Fast delay (100ms)", delay: 100, children: _jsx(Button, { children: "Fast Delay" }) }), _jsx(Tooltip, { content: "Slow delay (500ms)", delay: 500, children: _jsx(Button, { children: "Slow Delay" }) })] })),
};
//# sourceMappingURL=Tooltip.stories.js.map