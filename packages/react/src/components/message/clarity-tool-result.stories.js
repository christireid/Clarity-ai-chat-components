import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ClarityToolResult } from './clarity-tool-result';
import { createToolUIRegistry } from '../../agents/tool-ui-registry';
import { Card, CardContent, CardHeader, Badge } from '@clarity-chat/primitives';
const meta = {
    title: 'Components/ClarityToolResult',
    component: ClarityToolResult,
    parameters: {
        docs: {
            description: {
                component: `
Renders tool execution results using registered UI components.

## Features
- Type-safe tool component registry
- Automatic component resolution by tool name
- Fallback rendering for unregistered tools
- Message context integration
- Customizable component props

## Usage

\`\`\`tsx
import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQResults,
})

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'get_weather', args: { location: 'San Francisco' } }}
  result={{ temperature: 72, condition: 'Sunny' }}
  messages={messages}
/>
\`\`\`
        `,
            },
        },
        layout: 'padded',
    },
    tags: ['autodocs'],
};
export default meta;
function WeatherResult({ data }) {
    return (_jsxs(Card, { className: "mt-2", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Weather in ", data.location] }), _jsx(Badge, { variant: "info", children: data.condition })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-3xl font-bold", children: [data.temperature, "\u00B0", data.units === 'celsius' ? 'C' : 'F'] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Humidity:" }), ' ', data.humidity, "%"] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Wind:" }), ' ', data.windSpeed, " km/h"] })] })] }) })] }));
}
function FAQResults({ data }) {
    return (_jsxs(Card, { className: "mt-2", children: [_jsxs(CardHeader, { children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["FAQ Search: \"", data.query, "\""] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Found ", data.totalResults, " results"] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: data.results.map((faq, idx) => (_jsxs("div", { className: "border-l-2 border-primary pl-3", children: [_jsx("div", { className: "font-semibold", children: faq.question }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: faq.answer }), _jsx(Badge, { variant: "outline", className: "mt-2", children: faq.category })] }, idx))) }) })] }));
}
const mockMessages = [
    {
        id: '1',
        role: 'user',
        content: 'What is the weather in San Francisco?',
    },
    {
        id: '2',
        role: 'assistant',
        content: 'Let me check the weather for you.',
    },
];
export const WeatherTool = {
    args: {
        registry: createToolUIRegistry({
            get_weather: WeatherResult,
        }),
        toolCall: {
            name: 'get_weather',
            args: { location: 'San Francisco', units: 'fahrenheit' },
            id: 'call_123',
        },
        result: {
            location: 'San Francisco',
            temperature: 72,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 10,
            units: 'fahrenheit',
        },
        messages: mockMessages,
    },
    parameters: {
        docs: {
            description: {
                story: 'Weather tool result with custom UI component',
            },
        },
    },
};
export const FAQSearchTool = {
    args: {
        registry: createToolUIRegistry({
            search_faq: FAQResults,
        }),
        toolCall: {
            name: 'search_faq',
            args: { query: 'password reset', limit: 3 },
            id: 'call_456',
        },
        result: {
            query: 'password reset',
            results: [
                {
                    question: 'How do I reset my password?',
                    answer: 'Go to Settings > Security > Reset Password',
                    category: 'Account',
                },
                {
                    question: 'What if I forgot my email?',
                    answer: 'Contact support with your account details',
                    category: 'Account',
                },
                {
                    question: 'How long does reset take?',
                    answer: 'Password reset emails arrive within 5 minutes',
                    category: 'Account',
                },
            ],
            totalResults: 3,
        },
        messages: mockMessages,
    },
    parameters: {
        docs: {
            description: {
                story: 'FAQ search tool result with custom UI component',
            },
        },
    },
};
export const MultipleTools = {
    render: () => {
        const registry = createToolUIRegistry({
            get_weather: WeatherResult,
            search_faq: FAQResults,
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsx(ClarityToolResult, { registry: registry, toolCall: {
                        name: 'get_weather',
                        args: { location: 'New York', units: 'celsius' },
                        id: 'call_1',
                    }, result: {
                        location: 'New York',
                        temperature: 22,
                        condition: 'Cloudy',
                        humidity: 70,
                        windSpeed: 15,
                        units: 'celsius',
                    }, messages: mockMessages }), _jsx(ClarityToolResult, { registry: registry, toolCall: {
                        name: 'search_faq',
                        args: { query: 'billing', limit: 2 },
                        id: 'call_2',
                    }, result: {
                        query: 'billing',
                        results: [
                            {
                                question: 'What is your refund policy?',
                                answer: 'We offer 30-day money-back guarantee',
                                category: 'Billing',
                            },
                            {
                                question: 'How do I update my payment method?',
                                answer: 'Go to Settings > Billing > Payment Methods',
                                category: 'Billing',
                            },
                        ],
                        totalResults: 2,
                    }, messages: mockMessages })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Multiple tool results using the same registry',
            },
        },
    },
};
export const UnregisteredTool = {
    args: {
        registry: createToolUIRegistry({}),
        toolCall: {
            name: 'unknown_tool',
            args: { data: 'some data' },
            id: 'call_999',
        },
        result: {
            status: 'success',
            data: { value: 42, message: 'Tool executed successfully' },
        },
        messages: mockMessages,
    },
    parameters: {
        docs: {
            description: {
                story: 'Fallback rendering for unregistered tools (shows JSON)',
            },
        },
    },
};
export const WithHeader = {
    args: {
        registry: createToolUIRegistry({
            get_weather: WeatherResult,
        }),
        toolCall: {
            name: 'get_weather',
            args: { location: 'London', units: 'celsius' },
            id: 'call_789',
        },
        result: {
            location: 'London',
            temperature: 15,
            condition: 'Rainy',
            humidity: 80,
            windSpeed: 20,
            units: 'celsius',
        },
        messages: mockMessages,
        showHeader: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Tool result with header showing tool name',
            },
        },
    },
};
//# sourceMappingURL=clarity-tool-result.stories.js.map