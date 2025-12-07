import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useTokenTracker } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
const meta = {
    title: 'Hooks/Performance/UseTokenTracker',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
# useTokenTracker

Track token usage across a conversation with automatic cost calculation, limit warnings, and intelligent pruning suggestions.

## Features

- **Real-Time Tracking**: Monitor token usage as conversation grows
- **Cost Estimation**: Automatic cost calculation based on model pricing
- **Limit Warnings**: Alerts when approaching token limits
- **Multi-Model Support**: Works with GPT-4, Claude, and more
- **Pruning Suggestions**: Suggests when to remove old messages
- **Threshold Alerts**: Customizable warning and critical thresholds
- **Usage Stats**: Input/output token breakdown

## Use Cases

- **Chat Applications**: Track conversation token usage
- **Cost Monitoring**: Keep tabs on API costs
- **Context Management**: Know when to prune messages
- **Budget Alerts**: Warn users about cost
- **Performance**: Optimize for token limits

## Basic Usage

\`\`\`tsx
const { 
  tokens,
  estimatedCost,
  isNearLimit,
  isCritical,
  percentage,
  addMessage 
} = useTokenTracker({
  modelName: 'gpt-4-turbo',
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
})

// Add messages as they're sent
addMessage({
  role: 'user',
  content: 'Hello!',
  tokens: 5,
})
\`\`\`

## API Reference

### Options

- \`modelName\`: Model identifier (gpt-4, claude-3-opus, etc.)
- \`maxTokens\`: Manual token limit (auto-detected for known models)
- \`inputCostPerToken\`: Input token cost (auto-detected)
- \`outputCostPerToken\`: Output token cost (auto-detected)
- \`warningThreshold\`: Warning at % of limit (default: 0.8)
- \`criticalThreshold\`: Critical at % of limit (default: 0.95)
- \`onWarning\`: Callback when warning triggered
- \`onCritical\`: Callback when critical triggered

### Returns

- \`tokens\`: Total token count
- \`inputTokens\`: User message tokens
- \`outputTokens\`: Assistant response tokens
- \`estimatedCost\`: Total cost in dollars
- \`isNearLimit\`: At warning threshold
- \`isCritical\`: At critical threshold
- \`percentage\`: Percent of limit used (0-100)
- \`canSend(tokens)\`: Check if message fits
- \`suggestPruning\`: Should prune messages
- \`addMessage(msg)\`: Add message
- \`removeMessage(index)\`: Remove message
- \`reset()\`: Clear all tracking
`,
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Example
// ============================================================================
export const BasicUsage = {
    render: () => {
        const [messages, setMessages] = React.useState([]);
        const [inputText, setInputText] = React.useState('');
        const tracker = useTokenTracker({
            modelName: 'gpt-4-turbo',
            warningThreshold: 0.7,
            criticalThreshold: 0.9,
        });
        const addUserMessage = () => {
            if (!inputText.trim())
                return;
            const newMessage = {
                role: 'user',
                content: inputText,
                tokens: Math.ceil(inputText.split(' ').length * 1.3), // Rough estimate
            };
            setMessages([...messages, newMessage]);
            tracker.addMessage(newMessage);
            setInputText('');
            // Simulate AI response
            setTimeout(() => {
                const aiMessage = {
                    role: 'assistant',
                    content: 'This is a simulated AI response.',
                    tokens: 10,
                };
                setMessages((prev) => [...prev, aiMessage]);
                tracker.addMessage(aiMessage);
            }, 500);
        };
        return (_jsxs("div", { className: "space-y-6 max-w-2xl", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: `p-4 border rounded-lg ${tracker.isCritical ? 'border-red-500 bg-red-50' : tracker.isNearLimit ? 'border-yellow-500 bg-yellow-50' : 'border-border'}`, children: [_jsx("div", { className: "text-2xl font-bold", children: tracker.tokens.toLocaleString() }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Total Tokens" }), _jsxs("div", { className: "text-xs mt-1", children: [tracker.percentage.toFixed(1), "% of limit"] })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", tracker.estimatedCost.toFixed(4)] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Estimated Cost" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: messages.length }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Messages" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Token Usage" }), _jsxs("span", { children: [tracker.tokens, " / 128,000"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all ${tracker.isCritical ? 'bg-red-500' :
                                    tracker.isNearLimit ? 'bg-yellow-500' :
                                        'bg-green-500'}`, style: { width: `${Math.min(100, tracker.percentage)}%` } }) })] }), tracker.suggestPruning && (_jsxs("div", { className: "p-4 border border-yellow-500 bg-yellow-50 rounded-lg", children: [_jsx("div", { className: "font-semibold text-yellow-800", children: "\u26A0\uFE0F Consider Pruning Messages" }), _jsxs("div", { className: "text-sm text-yellow-700 mt-1", children: ["You're using ", tracker.percentage.toFixed(1), "% of the token limit. Consider removing older messages."] })] })), tracker.isCritical && (_jsxs("div", { className: "p-4 border border-red-500 bg-red-50 rounded-lg", children: [_jsx("div", { className: "font-semibold text-red-800", children: "\uD83D\uDEA8 Critical Token Limit" }), _jsxs("div", { className: "text-sm text-red-700 mt-1", children: ["You're at ", tracker.percentage.toFixed(1), "% of the limit! Remove messages to continue."] })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: inputText, onChange: (e) => setInputText(e.target.value), placeholder: "Type a message...", className: "w-full px-3 py-2 border rounded-lg", rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: addUserMessage, disabled: !inputText.trim(), children: "Send Message" }), _jsx(Button, { variant: "outline", onClick: () => {
                                        setMessages([]);
                                        tracker.reset();
                                    }, children: "Clear All" })] })] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4", children: messages.length === 0 ? (_jsx("p", { className: "text-muted-foreground text-center", children: "No messages yet" })) : (messages.map((msg, index) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-12' : 'bg-muted mr-12'}`, children: [_jsx("div", { className: "text-sm", children: msg.content }), _jsxs("div", { className: "text-xs mt-1 opacity-70", children: [msg.tokens, " tokens"] })] }, index)))) })] }));
    },
};
// ============================================================================
// Model Comparisons
// ============================================================================
export const ModelComparison = {
    render: () => {
        const models = ['gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-haiku'];
        const [selectedModel, setSelectedModel] = React.useState('gpt-4-turbo');
        const [messageCount, setMessageCount] = React.useState(0);
        const tracker = useTokenTracker({
            modelName: selectedModel,
        });
        const addSampleMessages = () => {
            const samples = [
                { role: 'user', content: 'What is machine learning?', tokens: 50 },
                { role: 'assistant', content: 'Machine learning is a subset of artificial intelligence...', tokens: 150 },
                { role: 'user', content: 'Can you explain deep learning?', tokens: 45 },
                { role: 'assistant', content: 'Deep learning uses neural networks with multiple layers...', tokens: 200 },
            ];
            samples.forEach(msg => tracker.addMessage(msg));
            setMessageCount((prev) => prev + samples.length);
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-medium", children: "Select Model:" }), _jsx("select", { value: selectedModel, onChange: (e) => {
                                setSelectedModel(e.target.value);
                                tracker.reset();
                                setMessageCount(0);
                            }, className: "px-3 py-1.5 border rounded", children: models.map((model) => (_jsx("option", { value: model, children: model }, model))) }), _jsx(Button, { onClick: addSampleMessages, size: "sm", children: "Add Sample Messages" }), _jsx(Button, { onClick: () => {
                                tracker.reset();
                                setMessageCount(0);
                            }, variant: "outline", size: "sm", children: "Reset" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-xl font-bold", children: tracker.tokens }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Tokens" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "text-xl font-bold", children: ["$", tracker.estimatedCost.toFixed(4)] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Cost" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-xl font-bold", children: tracker.inputTokens }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Input" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "text-xl font-bold", children: tracker.outputTokens }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Output" })] })] }), _jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsxs("div", { className: "font-semibold mb-2", children: ["Model: ", selectedModel] }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: ["Messages: ", messageCount] }), _jsxs("div", { children: ["Near Limit: ", tracker.isNearLimit ? '⚠️ Yes' : '✅ No'] }), _jsxs("div", { children: ["Critical: ", tracker.isCritical ? '🚨 Yes' : '✅ No'] }), _jsxs("div", { children: ["Suggest Pruning: ", tracker.suggestPruning ? '⚠️ Yes' : '✅ No'] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Compare token usage and costs across different models.',
            },
        },
    },
};
// ============================================================================
// Real-Time Monitoring
// ============================================================================
export const RealTimeMonitoring = {
    render: () => {
        const tracker = useTokenTracker({
            modelName: 'gpt-4',
            warningThreshold: 0.6,
            criticalThreshold: 0.8,
            onWarning: () => console.log('⚠️ Warning threshold reached!'),
            onCritical: () => console.log('🚨 Critical threshold reached!'),
        });
        const [isSimulating, setIsSimulating] = React.useState(false);
        const simulate = () => {
            setIsSimulating(true);
            let count = 0;
            const interval = setInterval(() => {
                if (count < 20) {
                    tracker.addMessage({
                        role: count % 2 === 0 ? 'user' : 'assistant',
                        content: `Message ${count}`,
                        tokens: Math.floor(Math.random() * 200) + 50,
                    });
                    count++;
                }
                else {
                    clearInterval(interval);
                    setIsSimulating(false);
                }
            }, 500);
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: simulate, disabled: isSimulating, children: isSimulating ? 'Simulating...' : 'Simulate Conversation' }), _jsx(Button, { onClick: tracker.reset, variant: "outline", children: "Reset" })] }), _jsxs("div", { className: "p-6 border rounded-lg space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Token Usage Monitor" }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm ${tracker.isCritical ? 'bg-red-100 text-red-800' :
                                        tracker.isNearLimit ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'}`, children: tracker.isCritical ? 'Critical' : tracker.isNearLimit ? 'Warning' : 'Normal' })] }), _jsx("div", { className: "h-8 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-300 ${tracker.isCritical ? 'bg-red-500' :
                                    tracker.isNearLimit ? 'bg-yellow-500' :
                                        'bg-green-500'}`, style: { width: `${Math.min(100, tracker.percentage)}%` } }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Total Tokens:" }), _jsx("span", { className: "ml-2 font-semibold", children: tracker.tokens.toLocaleString() })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Percentage:" }), _jsxs("span", { className: "ml-2 font-semibold", children: [tracker.percentage.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Input Tokens:" }), _jsx("span", { className: "ml-2 font-semibold", children: tracker.inputTokens.toLocaleString() })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Output Tokens:" }), _jsx("span", { className: "ml-2 font-semibold", children: tracker.outputTokens.toLocaleString() })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Est. Cost:" }), _jsxs("span", { className: "ml-2 font-semibold", children: ["$", tracker.estimatedCost.toFixed(4)] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Model:" }), _jsx("span", { className: "ml-2 font-semibold", children: "GPT-4" })] })] }), tracker.suggestPruning && (_jsx("div", { className: "p-3 bg-yellow-50 border border-yellow-200 rounded", children: _jsx("p", { className: "text-sm text-yellow-800", children: "\uD83D\uDCA1 Consider removing older messages to stay within token limits" }) }))] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Real-time monitoring with automatic warnings and cost tracking.',
            },
        },
    },
};
// ============================================================================
// Cost Tracking
// ============================================================================
export const CostTracking = {
    render: () => {
        const [model, setModel] = React.useState('gpt-4');
        const tracker = useTokenTracker({ modelName: model });
        const addExpensiveMessage = () => {
            tracker.addMessage({
                role: 'assistant',
                content: 'Long response...',
                tokens: 500,
            });
        };
        const addCheapMessage = () => {
            tracker.addMessage({
                role: 'user',
                content: 'Short question',
                tokens: 10,
            });
        };
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-medium", children: "Model:" }), _jsxs("select", { value: model, onChange: (e) => {
                                setModel(e.target.value);
                                tracker.reset();
                            }, className: "px-3 py-1.5 border rounded", children: [_jsx("option", { value: "gpt-4", children: "GPT-4 (Most Expensive)" }), _jsx("option", { value: "claude-3-opus", children: "Claude 3 Opus (Expensive)" }), _jsx("option", { value: "gpt-3.5-turbo", children: "GPT-3.5 Turbo (Cheap)" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: addExpensiveMessage, size: "sm", children: "Add Expensive Message (500 tokens)" }), _jsx(Button, { onClick: addCheapMessage, variant: "outline", size: "sm", children: "Add Cheap Message (10 tokens)" }), _jsx(Button, { onClick: tracker.reset, variant: "secondary", size: "sm", children: "Reset" })] }), _jsxs("div", { className: "p-6 border rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-4", children: "Cost Breakdown" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { children: ["Input tokens (", tracker.inputTokens, "):"] }), _jsxs("span", { className: "font-mono", children: ["$", (tracker.inputTokens * 0.00003).toFixed(6)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { children: ["Output tokens (", tracker.outputTokens, "):"] }), _jsxs("span", { className: "font-mono", children: ["$", (tracker.outputTokens * 0.00006).toFixed(6)] })] }), _jsxs("div", { className: "border-t pt-3 flex justify-between font-semibold", children: [_jsx("span", { children: "Total Cost:" }), _jsxs("span", { className: "font-mono text-lg", children: ["$", tracker.estimatedCost.toFixed(6)] })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Track costs across different models and message types.',
            },
        },
    },
};
//# sourceMappingURL=UseTokenTracker.stories.js.map