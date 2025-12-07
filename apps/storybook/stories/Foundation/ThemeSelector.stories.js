import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeSelector, ThemeSelectorDropdown, ThemeToggle } from '@clarity-chat/react';
const meta = {
    title: 'Foundation/ThemeSelector',
    component: ThemeSelector,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Theme management components inspired by companies like Intercom and Zendesk, combining visual previews with accessible toggles. Use alongside ThemeProvider to power live theming workflows.',
            },
        },
    },
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
        },
        showPreview: { control: 'boolean' },
    },
    args: {
        orientation: 'vertical',
        showPreview: true,
    },
    decorators: [
        (Story) => (_jsxs("div", { className: "flex w-full max-w-5xl flex-col gap-6", children: [_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Global toolbar" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Live preview uses Storybook global toolbar controls." })] }), _jsx(ThemeToggle, { className: "rounded-lg border border-border bg-background px-3 py-2 text-sm" })] }), _jsx(Story, {})] })),
    ],
    tags: ['autodocs'],
};
export default meta;
export const Gallery = {
    render: (args) => (_jsx(ThemeSelector, { ...args })),
};
export const Horizontal = {
    args: {
        orientation: 'horizontal',
    },
};
export const DropdownAndSelector = {
    name: 'Dropdown + Selector',
    render: (args) => (_jsxs("div", { className: "grid gap-6 md:grid-cols-[280px_1fr]", children: [_jsx(ThemeSelector, { ...args }), _jsxs("div", { className: "space-y-4 rounded-lg border border-border/50 bg-card p-6 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Dropdown surface" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Use the compact dropdown variant inside headers or mobile sheets while keeping the full selector available in settings." }), _jsx(ThemeSelectorDropdown, {})] })] })),
};
//# sourceMappingURL=ThemeSelector.stories.js.map