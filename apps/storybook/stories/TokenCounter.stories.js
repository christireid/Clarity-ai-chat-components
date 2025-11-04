import { TokenCounter } from '@clarity-chat/react';
const meta = {
    title: 'Components/TokenCounter',
    component: TokenCounter,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: { tokens: 1250, maxTokens: 4000, cost: 0.0025 },
};
export const NearLimit = {
    args: { tokens: 3800, maxTokens: 4000, cost: 0.0095 },
};
export const OverLimit = {
    args: { tokens: 4500, maxTokens: 4000, cost: 0.0113 },
};
//# sourceMappingURL=TokenCounter.stories.js.map