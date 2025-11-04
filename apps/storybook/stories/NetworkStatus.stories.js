import { NetworkStatus } from '@clarity-chat/react';
const meta = {
    title: 'Components/NetworkStatus',
    component: NetworkStatus,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
export const Online = { args: { status: 'online' } };
export const Offline = { args: { status: 'offline' } };
export const Slow = { args: { status: 'slow', latency: 2500 } };
export const Reconnecting = { args: { status: 'reconnecting', attempt: 2 } };
//# sourceMappingURL=NetworkStatus.stories.js.map