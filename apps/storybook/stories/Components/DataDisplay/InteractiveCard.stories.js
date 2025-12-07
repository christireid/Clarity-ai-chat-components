import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { InteractiveCard, InteractiveButton } from '@clarity-chat/react';
const meta = {
    title: 'Components/DataDisplay/InteractiveCard',
    component: InteractiveCard,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'High-affordance card surface inspired by Revolut and Pitch storybooks. Demonstrates hover elevation, ripple feedback, and keyboard support for accessible selection grids.',
            },
        },
    },
    argTypes: {
        interactive: { control: 'boolean' },
        selected: { control: 'boolean' },
        disabled: { control: 'boolean' },
        hoverIntensity: {
            control: 'radio',
            options: ['none', 'subtle', 'medium', 'strong'],
        },
        showRipple: { control: 'boolean' },
    },
    args: {
        interactive: true,
        hoverIntensity: 'medium',
        showRipple: true,
    },
    tags: ['autodocs'],
};
export default meta;
export const PricingTiles = {
    render: (args) => {
        const [activeTier, setActiveTier] = React.useState('growth');
        const tiers = [
            {
                id: 'starter',
                name: 'Starter',
                price: '$0',
                badge: 'Free',
                description: 'Playground access with mocked LLM responses.',
            },
            {
                id: 'growth',
                name: 'Growth',
                price: '$99',
                badge: 'Most popular',
                description: 'Production LLM routing, metrics, and guardrails.',
            },
            {
                id: 'scale',
                name: 'Scale',
                price: 'Custom',
                badge: 'Approved vendors',
                description: 'Enterprise SSO, seat management, and white-glove onboarding.',
            },
        ];
        return (_jsx("div", { className: "mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3", children: tiers.map((tier) => (_jsxs(InteractiveCard, { ...args, interactive: true, selected: activeTier === tier.id, onCardClick: () => setActiveTier(tier.id), className: "flex h-full flex-col gap-4 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-foreground", children: tier.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: tier.description })] }), _jsx("span", { className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary", children: tier.badge })] }), _jsx("p", { className: "text-3xl font-bold text-foreground", children: tier.price }), _jsxs("div", { className: "mt-auto flex items-center justify-between", children: [_jsx(InteractiveButton, { variant: activeTier === tier.id ? 'primary' : 'ghost', onClick: () => setActiveTier(tier.id), children: "Choose plan" }), _jsx("span", { className: "text-xs text-muted-foreground", children: "Keyboard support: Enter/Space" })] })] }, tier.id))) }));
    },
};
export const StatesGallery = {
    render: () => (_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs(InteractiveCard, { interactive: true, hoverIntensity: "subtle", className: "space-y-2 p-5", children: [_jsx("h4", { className: "text-sm font-semibold", children: "Interactive" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Default hover elevation and ripple feedback." })] }), _jsxs(InteractiveCard, { interactive: true, selected: true, className: "space-y-2 p-5", children: [_jsx("h4", { className: "text-sm font-semibold", children: "Selected" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Displays primary ring and top progress bar." })] }), _jsxs(InteractiveCard, { interactive: true, disabled: true, className: "space-y-2 p-5", children: [_jsx("h4", { className: "text-sm font-semibold", children: "Disabled" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "No hover or ripple, muted colors for clarity." })] }), _jsxs(InteractiveCard, { hoverIntensity: "none", className: "space-y-2 p-5", children: [_jsx("h4", { className: "text-sm font-semibold", children: "Static Card" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Use when you need a neutral informational surface." })] })] })),
};
//# sourceMappingURL=InteractiveCard.stories.js.map