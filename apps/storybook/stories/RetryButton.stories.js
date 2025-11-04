import { RetryButton } from '@clarity-chat/react';
const meta = {
    title: 'Components/RetryButton',
    component: RetryButton,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: { onRetry: () => console.log('Retry clicked') },
};
export const WithAttempts = {
    args: { onRetry: () => { }, attempt: 2, maxAttempts: 3 },
};
export const Loading = {
    args: { onRetry: () => { }, isRetrying: true },
};
//# sourceMappingURL=RetryButton.stories.js.map