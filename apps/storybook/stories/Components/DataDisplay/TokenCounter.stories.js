import { TokenCounter } from '@clarity-chat/react/components/token-counter';
/**
 * **TokenCounter Component**
 *
 * Component for displaying token usage with cost tracking
 * and limit warnings.
 *
 * **Key Features:**
 * - Token count display
 * - Maximum token limit
 * - Cost calculation
 * - Visual warnings when near/over limit
 * - Progress indicator
 * - Accessible with ARIA labels
 *
 * **Use Cases:**
 * - Token usage tracking
 * - Cost monitoring
 * - Limit enforcement
 * - Budget management
 */
const meta = {
    title: 'Components/DataDisplay/TokenCounter',
    component: TokenCounter,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Component for displaying token usage with cost tracking
and limit warnings.

## Features

- ✅ Token count display
- ✅ Maximum token limit
- ✅ Cost calculation
- ✅ Visual warnings when near/over limit
- ✅ Progress indicator
- ✅ Accessible with ARIA labels
- ✅ Color-coded status (normal/warning/error)

## Basic Usage

\`\`\`tsx
<TokenCounter
  tokens={1250}
  maxTokens={4000}
  cost={0.0025}
/>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        tokens: {
            description: 'Current number of tokens used',
            control: { type: 'number', min: 0, max: 10000 },
        },
        maxTokens: {
            description: 'Maximum allowed tokens',
            control: { type: 'number', min: 100, max: 100000 },
        },
        cost: {
            description: 'Cost in dollars for current token usage',
            control: { type: 'number', min: 0, max: 1, step: 0.0001 },
        },
        showCost: {
            description: 'Show cost information',
            control: 'boolean',
        },
        showProgress: {
            description: 'Show progress bar',
            control: 'boolean',
        },
    },
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