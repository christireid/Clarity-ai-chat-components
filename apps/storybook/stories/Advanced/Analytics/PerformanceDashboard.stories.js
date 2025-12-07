import { jsx as _jsx } from "react/jsx-runtime";
import { PerformanceDashboard } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Analytics/PerformanceDashboard',
    component: PerformanceDashboard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'In-app observability widget mirroring dashboards in Datadog, Vercel, and the Storybook Design System. Useful for monitoring render costs, memory, and perceived latency during AI sessions.',
            },
        },
    },
    argTypes: {
        detailed: { control: 'boolean' },
        updateInterval: {
            control: { type: 'number', min: 500, step: 500 },
        },
    },
    args: {
        detailed: true,
        updateInterval: 2000,
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-full max-w-3xl", children: _jsx(Story, {}) })),
    ],
    tags: ['autodocs'],
};
export default meta;
export const LiveMetrics = {};
export const Compact = {
    args: {
        detailed: false,
        updateInterval: 1000,
    },
};
//# sourceMappingURL=PerformanceDashboard.stories.js.map