import { TokenCounter } from '@clarity-chat/react/components/TokenCounter';
const meta = {
    title: 'Components/TokenCounter/Essentials',
    component: TokenCounter,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The TokenCounter component displays token usage with cost tracking and
limit warnings. This track shows the essential patterns you'll use in
90% of cases.

## When to Use TokenCounter

- ✅ Track API token usage
- ✅ Monitor costs
- ✅ Enforce token limits
- ✅ Budget management

## Key Features

- **Token Display** - Current and maximum tokens
- **Cost Tracking** - Real-time cost calculation
- **Visual Warnings** - Color-coded status (normal/warning/error)
- **Progress Indicator** - Visual progress bar
- **Accessibility** - WCAG AAA compliant
        `,
            },
        },
    },
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
            control: { type: 'boolean' },
            defaultValue: true,
        },
        showProgress: {
            description: 'Show progress bar',
            control: { type: 'boolean' },
            defaultValue: true,
        },
    },
};
export default meta;
export const BasicCounter = {
    args: {
        tokens: 1250,
        maxTokens: 4000,
        cost: 0.0025,
        showCost: true,
        showProgress: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Basic token counter with cost tracking. Shows current usage, limit,
and cost.

**Key Points:**
- Set tokens and maxTokens
- Include cost for cost tracking
- Enable progress bar for visual feedback

This pattern works for 90% of use cases.
        `,
            },
        },
    },
};
export const LowUsage = {
    args: {
        tokens: 500,
        maxTokens: 4000,
        cost: 0.001,
        showCost: true,
        showProgress: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Low usage state. Shows normal status when usage is well below limit.
        `,
            },
        },
    },
};
export const NearLimit = {
    args: {
        tokens: 3500,
        maxTokens: 4000,
        cost: 0.00875,
        showCost: true,
        showProgress: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Near limit state. Shows warning when approaching token limit (typically
at 80%+ usage).
        `,
            },
        },
    },
};
export const OverLimit = {
    args: {
        tokens: 4500,
        maxTokens: 4000,
        cost: 0.01125,
        showCost: true,
        showProgress: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Over limit state. Shows error status when token limit is exceeded.
        `,
            },
        },
    },
};
export const WithoutCost = {
    args: {
        tokens: 1250,
        maxTokens: 4000,
        showCost: false,
        showProgress: true,
    },
    parameters: {
        docs: {
            description: {
                story: `
Token counter without cost display. Use when cost tracking isn't needed
or cost data isn't available.
        `,
            },
        },
    },
};
export const WithoutProgress = {
    args: {
        tokens: 1250,
        maxTokens: 4000,
        cost: 0.0025,
        showCost: true,
        showProgress: false,
    },
    parameters: {
        docs: {
            description: {
                story: `
Token counter without progress bar. Use for minimal display when space
is limited.
        `,
            },
        },
    },
};
//# sourceMappingURL=Essentials.stories.js.map