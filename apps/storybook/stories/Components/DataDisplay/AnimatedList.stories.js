import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AnimatedList, AnimatedListItem, FadePresence, SlidePresence, ScalePresence, ConditionalPresence, } from '@clarity-chat/react';
const demoItems = ['Define success metrics', 'Sync with product', 'Review transcripts', 'Ship updates'];
const meta = {
    title: 'Components/DataDisplay/AnimatedList',
    component: AnimatedList,
    subcomponents: {
        AnimatedListItem,
        FadePresence,
        SlidePresence,
        ScalePresence,
        ConditionalPresence,
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Motion primitives for sequencing chat UI affordances. Inspired by Storybook Design System, Linear, and GitHub Copilot Playbooks—each story highlights interactive guidance, accessibility, and motion guidelines.',
            },
        },
    },
    argTypes: {
        stagger: {
            control: 'select',
            options: ['instant', 'fast', 'normal', 'slow'],
            description: 'Timing between child animations',
        },
        delay: {
            control: 'number',
            description: 'Delay (ms) before the animation starts',
        },
        className: {
            control: false,
        },
    },
    args: {
        stagger: 'normal',
        delay: 0,
    },
    tags: ['autodocs'],
};
export default meta;
export const TaskQueue = {
    render: (args) => {
        const [items, setItems] = React.useState(demoItems);
        return (_jsxs("div", { className: "flex min-h-[280px] flex-col items-center justify-center gap-4 bg-muted/40 p-10", children: [_jsx(AnimatedList, { ...args, className: "w-full max-w-lg space-y-3", children: items.map((item, index) => (_jsx(AnimatedListItem, { variant: index % 2 === 0 ? 'slide' : 'fade', duration: index % 2 === 0 ? 'fast' : 'normal', className: "rounded-xl border border-border bg-card px-4 py-3 shadow-sm", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary", children: index + 1 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: item }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Sequenced with ", index % 2 === 0 ? 'slide' : 'fade', " motion"] })] })] }) }, item))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1 text-sm hover:bg-accent", onClick: () => setItems((prev) => [
                                `New insight ${prev.length + 1}`,
                                ...prev,
                            ]), children: "Prepend Item" }), _jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-3 py-1 text-sm hover:bg-accent", onClick: () => setItems((prev) => [...prev, `New follow-up ${prev.length + 1}`]), children: "Append Item" }), _jsx("button", { type: "button", className: "rounded-lg border border-destructive bg-background px-3 py-1 text-sm text-destructive hover:bg-destructive/10", onClick: () => setItems((prev) => prev.slice(1)), children: "Remove Oldest" })] })] }));
    },
};
export const PresencePatterns = {
    name: 'Presence Wrappers',
    render: () => {
        const [active, setActive] = React.useState('fade');
        const [showDetails, setShowDetails] = React.useState(true);
        return (_jsxs("div", { className: "mx-auto flex max-w-4xl flex-col gap-6 py-8", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [['fade', 'slide', 'scale'].map((option) => (_jsx("button", { type: "button", className: `rounded-full border px-4 py-1 text-sm capitalize transition ${active === option
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-primary/50'}`, onClick: () => setActive(option), children: option }, option))), _jsxs("label", { className: "ml-auto flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: showDetails, onChange: () => setShowDetails((prev) => !prev) }), "Toggle content"] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsx(FadePresence, { className: "rounded-xl border border-border bg-card p-6 text-center shadow-sm", children: _jsxs("div", { children: [_jsx("h3", { className: "mb-2 text-sm font-semibold", children: "FadePresence" }), showDetails && _jsx("p", { className: "text-xs text-muted-foreground", children: "Use for low-affordance UI such as toolbars." })] }) }), _jsx(SlidePresence, { direction: active === 'slide' ? 'up' : 'right', className: "rounded-xl border border-border bg-card p-6 text-center shadow-sm", children: _jsxs("div", { children: [_jsx("h3", { className: "mb-2 text-sm font-semibold", children: "SlidePresence" }), showDetails && (_jsx("p", { className: "text-xs text-muted-foreground", children: "Ideal for banners, toasts, and drawers." }))] }) }), _jsx(ScalePresence, { className: "rounded-xl border border-border bg-card p-6 text-center shadow-sm", children: _jsxs("div", { children: [_jsx("h3", { className: "mb-2 text-sm font-semibold", children: "ScalePresence" }), showDetails && (_jsx("p", { className: "text-xs text-muted-foreground", children: "Use sparingly for celebratory UI moments." }))] }) })] }), _jsx(ConditionalPresence, { show: showDetails, variant: active, className: "rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Conditional presence ensures exit transitions respect accessibility preferences and user intent." }) })] }));
    },
};
//# sourceMappingURL=AnimatedList.stories.js.map