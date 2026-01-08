import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TokenCostPreview } from './TokenCostPreview';
import { useState, useEffect } from 'react';
const meta = {
    title: 'Components/TokenCostPreview',
    component: TokenCostPreview,
    parameters: {
        docs: {
            description: {
                component: `
Real-time token count and cost estimation component.

## Features
- Live token estimation as users type
- Cost calculation based on model pricing
- Throttled updates to prevent excessive renders
- Accessible with ARIA live regions
- Reduced motion support
- Customizable formatters

## Usage

\`\`\`tsx
import { TokenCostPreview } from '@clarity-chat/react'

function ChatInput() {
  const [message, setMessage] = useState('')

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <TokenCostPreview
        text={message}
        model="gpt-4"
        onCostChange={(cost, tokens) => {
          if (cost > 0.10) {
            console.log('Warning: message is expensive!')
          }
        }}
      />
    </div>
  )
}
\`\`\`
        `,
            },
        },
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        model: {
            control: 'select',
            options: [
                'gpt-4',
                'gpt-4o',
                'gpt-3.5-turbo',
                'claude-3-5-sonnet',
                'claude-3-opus',
                'gemini-1.5-pro',
            ],
            description: 'Model to use for pricing',
        },
        showTokenCount: {
            control: 'boolean',
            description: 'Show token count',
        },
        showCost: {
            control: 'boolean',
            description: 'Show cost estimate',
        },
        minDisplayCost: {
            control: 'number',
            description: 'Minimum cost threshold to display',
        },
        throttleMs: {
            control: 'number',
            description: 'Throttle updates (ms)',
        },
    },
};
export default meta;
// Basic example
export const Default = {
    args: {
        text: 'Hello, this is a sample message to estimate tokens and cost.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
};
// Short message
export const ShortMessage = {
    args: {
        text: 'Hi!',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
    parameters: {
        docs: {
            description: {
                story: 'Very short messages show minimal token counts',
            },
        },
    },
};
// Long message
export const LongMessage = {
    args: {
        text: `This is a much longer message that demonstrates how the token count and cost estimation works for substantial text input. When users write detailed prompts or provide extensive context, the token count will increase significantly, and the cost estimate will reflect the higher token usage. This helps users understand the cost implications of their messages before sending them.

The TokenCostPreview component updates in real-time as you type, providing immediate feedback about your message's cost. This is particularly useful for applications where users need to be mindful of API costs.

With support for multiple models like GPT-4, Claude, and Gemini, users can see how costs vary across different providers.`,
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
    parameters: {
        docs: {
            description: {
                story: 'Long messages show higher token counts with K suffix',
            },
        },
    },
};
// Token count only
export const TokenCountOnly = {
    args: {
        text: 'This message shows only the token count, not the cost.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Display only the token count without cost estimate',
            },
        },
    },
};
// Cost only
export const CostOnly = {
    args: {
        text: 'This message shows only the cost estimate, not the token count.',
        model: 'gpt-4',
        showTokenCount: false,
        showCost: true,
        minDisplayCost: 0,
    },
    parameters: {
        docs: {
            description: {
                story: 'Display only the cost estimate without token count',
            },
        },
    },
};
// Different models
export const GPT4 = {
    args: {
        text: 'This message uses GPT-4 pricing (most expensive OpenAI model).',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
};
export const GPT35Turbo = {
    args: {
        text: 'This message uses GPT-3.5-Turbo pricing (more affordable).',
        model: 'gpt-3.5-turbo',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
};
export const Claude35Sonnet = {
    args: {
        text: 'This message uses Claude 3.5 Sonnet pricing from Anthropic.',
        model: 'claude-3-5-sonnet',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
};
// Custom formatting
export const CustomFormatters = {
    args: {
        text: 'This message uses custom formatters for display.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
        formatCost: (cost) => `~$${cost.toFixed(2)} USD`,
        formatTokens: (tokens) => `${tokens} tokens used`,
    },
    parameters: {
        docs: {
            description: {
                story: 'Custom format functions for tokens and cost',
            },
        },
    },
};
// With callback
export const WithCallback = {
    args: {
        text: 'Type here to see cost change callbacks in the actions tab.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
    },
    argTypes: {
        onCostChange: { action: 'cost changed' },
    },
    parameters: {
        docs: {
            description: {
                story: 'Callback fires when cost changes (see Actions tab)',
            },
        },
    },
};
// Empty state
export const EmptyText = {
    args: {
        text: '',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Component renders nothing when text is empty',
            },
        },
    },
};
// Custom styling
export const CustomClassName = {
    args: {
        text: 'This message has custom styling via className.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
        className: 'text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-full',
    },
    parameters: {
        docs: {
            description: {
                story: 'Apply custom styling via className prop',
            },
        },
    },
};
// Accessibility demo
export const WithAriaLabel = {
    args: {
        text: 'This component has enhanced accessibility features.',
        model: 'gpt-4',
        showTokenCount: true,
        showCost: true,
        minDisplayCost: 0,
        ariaLabel: 'Message cost: approximately 10 tokens',
        id: 'token-preview-1',
    },
    parameters: {
        docs: {
            description: {
                story: 'Custom aria-label and ID for accessibility. The component uses role="status" and aria-live="polite" for screen readers.',
            },
        },
    },
};
// Interactive typing demo
export const InteractiveTyping = {
    render: () => {
        const [text, setText] = useState('');
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "demo-input", className: "block text-sm font-medium", children: "Type a message:" }), _jsx("textarea", { id: "demo-input", className: "w-full p-3 border rounded-lg resize-none h-32", value: text, onChange: (e) => setText(e.target.value), placeholder: "Start typing to see real-time token and cost estimation..." })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(TokenCostPreview, { text: text, model: "gpt-4", showTokenCount: true, showCost: true, minDisplayCost: 0 }), _jsx("button", { onClick: () => setText(''), className: "px-3 py-1 text-sm text-gray-500 hover:text-gray-700", children: "Clear" })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo - type to see live token/cost updates',
            },
        },
    },
};
// Model comparison
export const ModelComparison = {
    render: () => {
        const [text, setText] = useState('Compare costs across different AI models by typing your message here.');
        const models = [
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
            { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-opus', name: 'Claude 3 Opus' },
        ];
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "compare-input", className: "block text-sm font-medium", children: "Message:" }), _jsx("textarea", { id: "compare-input", className: "w-full p-3 border rounded-lg resize-none h-24", value: text, onChange: (e) => setText(e.target.value) })] }), _jsx("div", { className: "space-y-2", children: models.map((model) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsx("span", { className: "font-medium", children: model.name }), _jsx(TokenCostPreview, { text: text, model: model.id, showTokenCount: true, showCost: true, minDisplayCost: 0 })] }, model.id))) })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Compare costs across multiple models side-by-side',
            },
        },
    },
};
// Cost threshold warning
export const CostThresholdWarning = {
    render: () => {
        const [text, setText] = useState('');
        const [warning, setWarning] = useState(null);
        const handleCostChange = (cost, tokens) => {
            if (cost > 0.01) {
                setWarning(`Warning: This message will cost $${cost.toFixed(4)}`);
            }
            else {
                setWarning(null);
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "warning-input", className: "block text-sm font-medium", children: "Type a long message to trigger cost warning:" }), _jsx("textarea", { id: "warning-input", className: "w-full p-3 border rounded-lg resize-none h-32", value: text, onChange: (e) => setText(e.target.value), placeholder: "Type a longer message to see the cost warning..." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(TokenCostPreview, { text: text, model: "gpt-4", showTokenCount: true, showCost: true, minDisplayCost: 0, onCostChange: handleCostChange }), warning && (_jsxs("span", { className: "text-amber-600 text-sm font-medium", children: ["\u26A0\uFE0F ", warning] }))] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Uses onCostChange callback to show warning when cost exceeds threshold',
            },
        },
    },
};
// Simulated typing
export const SimulatedTyping = {
    render: () => {
        const [text, setText] = useState('');
        const [isTyping, setIsTyping] = useState(false);
        const sampleText = `Hello! I'm demonstrating the TokenCostPreview component. Watch as the token count and cost update in real-time as I type this message. This is useful for chat applications where users need to understand the cost implications of their messages.`;
        const startTyping = () => {
            setText('');
            setIsTyping(true);
            let index = 0;
            const interval = setInterval(() => {
                if (index < sampleText.length) {
                    setText(sampleText.slice(0, index + 1));
                    index++;
                }
                else {
                    setIsTyping(false);
                    clearInterval(interval);
                }
            }, 30);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: startTyping, disabled: isTyping, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50", children: isTyping ? 'Typing...' : 'Start Demo' }), _jsx("button", { onClick: () => setText(''), disabled: isTyping, className: "px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50", children: "Clear" })] }), _jsx("div", { className: "p-4 bg-gray-50 rounded-lg min-h-[100px]", children: _jsx("p", { className: "text-gray-700", children: text || 'Click "Start Demo" to begin' }) }), _jsx(TokenCostPreview, { text: text, model: "gpt-4", showTokenCount: true, showCost: true, minDisplayCost: 0, throttleMs: 50 })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Watch token count update as text is typed',
            },
        },
    },
};
//# sourceMappingURL=TokenCostPreview.stories.js.map