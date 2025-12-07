import { jsx as _jsx } from "react/jsx-runtime";
import { AuthTenantDashboard } from '@clarity-chat/react';
const meta = {
    title: 'Advanced/Enterprise/AuthTenantDashboard',
    component: AuthTenantDashboard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Dashboard for managing tenant authentication, seat usage, and plan information.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx("div", { className: "w-full max-w-2xl", children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    args: {
        organizationName: 'Acme Corporation',
        planName: 'Enterprise Plan',
        planBadge: 'Active',
        renewalDate: '2024-12-31',
        seatUsage: {
            label: 'Seats',
            used: 45,
            total: 100,
        },
        apiUsage: {
            label: 'API Calls',
            value: '1.2M / 2M',
        },
    },
};
export const WithActions = {
    args: {
        organizationName: 'Tech Startup Inc',
        planName: 'Professional Plan',
        planBadge: 'Active',
        renewalDate: '2024-06-30',
        seatUsage: {
            label: 'Seats',
            used: 12,
            total: 25,
        },
        apiUsage: {
            label: 'API Calls',
            value: '500K / 1M',
        },
        actions: [
            {
                id: 'upgrade',
                label: 'Upgrade Plan',
                onClick: () => alert('Upgrade clicked'),
            },
            {
                id: 'manage',
                label: 'Manage Seats',
                onClick: () => alert('Manage seats clicked'),
            },
        ],
    },
};
export const NearLimit = {
    args: {
        organizationName: 'Growing Company',
        planName: 'Business Plan',
        planBadge: 'Active',
        renewalDate: '2024-03-15',
        seatUsage: {
            label: 'Seats',
            used: 48,
            total: 50,
        },
        apiUsage: {
            label: 'API Calls',
            value: '950K / 1M',
        },
    },
};
export const NoApiUsage = {
    args: {
        organizationName: 'Small Team',
        planName: 'Starter Plan',
        planBadge: 'Active',
        renewalDate: '2024-09-30',
        seatUsage: {
            label: 'Seats',
            used: 5,
            total: 10,
        },
    },
};
export const NoRenewalDate = {
    args: {
        organizationName: 'New Organization',
        planName: 'Trial Plan',
        seatUsage: {
            label: 'Seats',
            used: 2,
            total: 5,
        },
    },
};
export const FullUsage = {
    args: {
        organizationName: 'Large Enterprise',
        planName: 'Enterprise Plan',
        planBadge: 'Active',
        renewalDate: '2024-12-31',
        seatUsage: {
            label: 'Seats',
            used: 100,
            total: 100,
        },
        apiUsage: {
            label: 'API Calls',
            value: '2M / 2M',
        },
    },
};
//# sourceMappingURL=AuthTenantDashboard.stories.js.map