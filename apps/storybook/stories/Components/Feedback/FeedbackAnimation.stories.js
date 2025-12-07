import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FeedbackAnimation, SuccessCheckmark, ErrorShake, PulseAttention, } from '@clarity-chat/react';
const meta = {
    title: 'Components/Feedback/FeedbackAnimation',
    component: FeedbackAnimation,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Micro-interactions that mirror the polish seen in Linear, Stripe, and Shopify Polaris design systems. Use them to confirm actions, highlight errors, and guide focus without overwhelming users.',
            },
        },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
        },
        message: {
            control: 'text',
        },
        duration: {
            control: { type: 'number', min: 0, step: 250 },
        },
    },
    args: {
        type: 'success',
        message: 'Changes published to production',
        duration: 2000,
    },
    tags: ['autodocs'],
};
export default meta;
export const Playground = {
    render: (args) => {
        const [show, setShow] = React.useState(true);
        React.useEffect(() => {
            if (!show) {
                const timer = setTimeout(() => setShow(true), 400);
                return () => clearTimeout(timer);
            }
            return undefined;
        }, [show]);
        return (_jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(FeedbackAnimation, { ...args, show: show, onComplete: () => setShow(false) }), _jsx("button", { type: "button", className: "rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent", onClick: () => setShow((prev) => !prev), children: show ? 'Replay' : 'Play animation' })] }));
    },
};
export const Library = {
    name: 'Animation Library',
    render: () => {
        const [shake, setShake] = React.useState(false);
        const [pulse, setPulse] = React.useState(true);
        return (_jsxs("div", { className: "flex max-w-4xl flex-col gap-8", children: [_jsx("div", { className: "grid gap-6 md:grid-cols-2", children: ['success', 'error', 'warning', 'info'].map((type) => (_jsx(FeedbackAnimation, { type: type, show: true, duration: 0, message: `FeedbackAnimation type="${type}"`, className: "min-h-[180px]" }, type))) }), _jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [_jsxs("div", { className: "flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6", children: [_jsx(SuccessCheckmark, { show: true, size: 64 }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Use after optimistic saves succeed." })] }), _jsxs(ErrorShake, { trigger: shake, className: "rounded-xl border border-border bg-card p-6 text-center", children: [_jsx("p", { className: "text-sm font-semibold text-destructive", children: "Incorrect API key" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "The field shakes to highlight the error." }), _jsx("button", { type: "button", className: "mt-4 rounded-lg border border-destructive px-3 py-1 text-xs text-destructive hover:bg-destructive/10", onClick: () => {
                                        setShake(false);
                                        requestAnimationFrame(() => setShake(true));
                                    }, children: "Trigger shake" })] }), _jsxs(PulseAttention, { active: pulse, className: "rounded-xl border border-border bg-card p-6 text-center", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Awaiting approval" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Pulse draws attention without blocking interaction." }), _jsx("button", { type: "button", className: "mt-4 rounded-lg border border-border px-3 py-1 text-xs hover:bg-accent", onClick: () => setPulse((prev) => !prev), children: "Toggle pulse" })] })] })] }));
    },
};
//# sourceMappingURL=FeedbackAnimation.stories.js.map